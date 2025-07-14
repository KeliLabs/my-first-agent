const express = require('express');
// const { ChatOpenAI } = require('@langchain/openai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { SearchApi } = require('@langchain/community/tools/searchapi');
const { AgentExecutor } = require("langchain/agents");
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require("@langchain/core/runnables");
const { AgentFinish, AgentAction } = require("@langchain/core/agents");
const { BaseMessageChunk } = require("@langchain/core/messages");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize LangChain models
const llm = new ChatGoogleGenerativeAI({
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
});
const tools = [
  new SearchApi(process.env.SEARCHAPI_API_KEY, {
    engine: "google_news",
  }),
];
// Default to Google Gemini, but allow switching
const getLLM = (provider = 'gemini') => {
      return llm;
};

const parser = new StringOutputParser();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.post('/chat', async (req, res) => {
  try {
    const { message, provider = 'gemini' } = req.body;
    if (provider === 'gemini' && !process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        error: 'Google API key not configured. Please set GOOGLE_API_KEY in your .env file.'
      });
    }

    const llm = getLLM(provider);
    
    // First, check if the user's message requires a search
    const searchIntentMessages = [
      new SystemMessage(`Analyze if this message requires searching for current information, news, or real-time data. 
      Respond with only "true" if search is needed, "false" if it's a general conversation that can be answered with existing knowledge.
      
      Examples that need search: "latest news about AI", "current weather", "recent events", "what happened today"
      Examples that don't need search: "hello", "how are you", "explain quantum physics", "write a poem"`),
      new HumanMessage(message)
    ];
    
    const searchIntentResponse = await llm.invoke(searchIntentMessages);
    const needsSearch = searchIntentResponse.content.toLowerCase().includes('true');
    
    console.log(`User message: "${message}"`);
    console.log(`Needs search: ${needsSearch}`);
    
    if (needsSearch) {
      // Use search tool for queries that need current information
      console.log('🔍 Using search tool for this query...');
      
      const { SerpAPI } = require("@langchain/community/tools/serpapi");
      const { RunnableLambda } = require("@langchain/core/runnables");
      const tool = new SerpAPI(); 
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant with access to search tools. Use the search results to provide accurate, up-to-date information."],
        ["placeholder", "{messages}"],
      ]);
      
      const llmWithTools = llm.bindTools([tool]);
      const chain = prompt.pipe(llmWithTools);
      
      const toolChain = RunnableLambda.from(async (userInput, config) => {
        const humanMessage = new HumanMessage(userInput);
        const aiMsg = await chain.invoke(
          {
            messages: [new HumanMessage(userInput)],
          },
          config
        );
        
        if (aiMsg.tool_calls && aiMsg.tool_calls.length > 0) {
          console.log('🔧 Tool calls detected:', aiMsg.tool_calls.length);
          const toolMsgs = await tool.batch(aiMsg.tool_calls, config);
          console.log('🔧 Tool messages:', toolMsgs);
          
          return chain.invoke(
            {
              messages: [humanMessage, aiMsg, ...toolMsgs],
            },
            config
          );
        } else {
          // No tool calls needed, return the AI message directly
          return aiMsg;
        }
      });

      const toolChainResult = await toolChain.invoke(message);
      console.log("🔍 Search result:", toolChainResult.content);
      
      const parsed = await parser.invoke(toolChainResult.content);
      res.json({ response: parsed });
      
    } else {
      // Use regular LLM for general conversation
      console.log('💬 Using regular chat (no search needed)...');
      
      const messages = [
        new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
        new HumanMessage(message)
      ];
      
      const response = await llm.invoke(messages);
      console.log("💬 Regular response:", response.content);
      
      const parsed = await parser.invoke(response.content);
      res.json({ response: parsed });
    }
    
  } catch (error) {
    console.error('Error:', error);
    if (error.message.includes('Google API key not configured')) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 LangChain Hello World app listening at http://localhost:${port}`);
  console.log(`📝 Make sure to set your API keys in the .env file:`);
  console.log(`   - GOOGLE_API_KEY for Google Gemini`);
});
