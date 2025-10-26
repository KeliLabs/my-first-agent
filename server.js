const express = require('express');
const { randomUUID } = require('crypto');
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
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { isInitializeRequest } = require('@modelcontextprotocol/sdk/types.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
console.log("Google API Key:", process.env.GOOGLE_API_KEY);


// Middleware
app.use(express.json());

// Enable CORS for MCP protocol
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Mcp-Session-Id');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Initialize LangChain models
const llm = new ChatGoogleGenerativeAI({
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
});
// Initialize tools only if API key is available
const tools = process.env.SEARCHAPI_API_KEY 
  ? [new SearchApi(process.env.SEARCHAPI_API_KEY, {
      engine: "google_news",
    })]
  : [];
// Default to Google Gemini, but allow switching
const getLLM = (provider = 'gemini') => {
      return llm;
};

const parser = new StringOutputParser();

// Company information for MCP
const COMPANY_INFO = {
  name: "KeliLabs",
  description: "KeliLabs is dedicated to building innovative AI agents and tools that enable agentic interoperability and enhance the AI ecosystem.",
  focus_areas: [
    "AI Agent Development",
    "LangChain Integration",
    "Model Context Protocol (MCP) Implementation",
    "Multi-Provider AI Support",
    "Conversational AI"
  ],
  stage: "Development",
  approach: "Open-source AI agent development with focus on interoperability",
  website: "https://github.com/KeliLabs",
  contact: "contact@kelilabs.com"
};

// Create MCP server instance
function createMcpServer() {
  const server = new McpServer({
    name: "my-first-agent-mcp-server",
    version: "1.0.0"
  });

  // Add the agent info tool
  server.tool(
    "get_agent_info",
    "Get information about this agent including capabilities and configuration",
    {},
    async () => {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            name: 'my-first-agent',
            version: '1.0.0',
            description: 'A LangChain-powered AI agent with OpenAI and Google Gemini support',
            capabilities: ['chat', 'search', 'langchain-integration'],
            providers: ['openai', 'google-gemini'],
            type: 'conversational-agent',
            framework: 'langchain',
            runtime: 'node.js'
          }, null, 2)
        }]
      };
    }
  );

  // Add company info tool
  server.tool(
    "get_company_info",
    "Get information about the company/organization behind this agent",
    {},
    async () => {
      return {
        content: [{
          type: "text",
          text: JSON.stringify(COMPANY_INFO, null, 2)
        }]
      };
    }
  );

  return server;
}

// Map to store transports by session ID
const transports = {};

// Root endpoint with basic info
app.get('/', (req, res) => {
  res.json({
    name: 'my-first-agent MCP Server',
    version: '1.0.0',
    description: 'LangChain-powered AI agent with OpenAI and Google Gemini support',
    endpoints: {
      bot: '/bot',
      chat: '/chat',
      health: '/health',
      mcp: '/mcp'
    },
    transport: 'HTTP',
    framework: 'langchain'
  });
});

// Bot interface endpoint
app.get('/bot', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'my-first-agent',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    providers: {
      gemini: !!process.env.GOOGLE_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    }
  });
});

// MCP endpoint - handles MCP protocol requests (POST, GET, DELETE)
app.all('/mcp', async (req, res) => {
  try {
    // Handle POST requests for client-to-server communication
    if (req.method === 'POST') {
      const sessionId = req.headers['mcp-session-id'];
      let transport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports[sessionId] = transport;
            console.log(`MCP Session initialized: ${sessionId}`);
          }
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
            console.log(`MCP Session closed: ${transport.sessionId}`);
          }
        };

        // Create and connect the MCP server
        const server = createMcpServer();
        await server.connect(transport);
      } else {
        // Invalid request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided or not an initialization request',
          },
          id: null,
        });
        return;
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body);
    }
    // Handle GET requests for server-to-client notifications
    else if (req.method === 'GET') {
      const sessionId = req.headers['mcp-session-id'];
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
      }
      
      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    }
    // Handle DELETE requests for session termination
    else if (req.method === 'DELETE') {
      const sessionId = req.headers['mcp-session-id'];
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
      }
      
      const transport = transports[sessionId];
      delete transports[sessionId];
      transport.close();
      res.status(200).send('Session terminated');
    }
    // Method not allowed
    else {
      res.status(405).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed',
        },
        id: null,
      });
    }
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
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

// Serve static files for CSS and JS (after all API routes)
app.use(express.static('public'));


app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 LangChain Hello World app listening at http://localhost:${port}`);
  console.log(`📝 Make sure to set your API keys in the .env file:`);
  console.log(`   - GOOGLE_API_KEY for Google Gemini`);
});
