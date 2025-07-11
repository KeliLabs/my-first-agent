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
    const messages = [
      new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
      new HumanMessage(message)
    ];
    const response = await llm.invoke(messages);
    console.log(response)
    //
    const { SerpAPI } = require("@langchain/community/tools/serpapi");
    const { RunnableLambda } = require("@langchain/core/runnables");
    const tool = new SerpAPI(); 
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
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
      const toolMsgs = await tool.batch(aiMsg.tool_calls, config);
      return chain.invoke(
        {
          messages: [humanMessage, aiMsg, ...toolMsgs],
        },
        config
      );
    });

    const toolChainResult = await toolChain.invoke(message);
    console.log("toolChainResult",toolChainResult)
    const parsed = await parser.invoke(toolChainResult.content);
    console.log('parser:', parsed);
    res.json({ response: parsed });
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
