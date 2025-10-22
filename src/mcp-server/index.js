#!/usr/bin/env node

/**
 * MCP Server for Agent Interoperability
 * 
 * This server implements the Model Context Protocol (MCP) to expose
 * agent information for agentic interactions and registry purposes.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Agent metadata
const AGENT_INFO = {
  name: 'my-first-agent',
  version: '1.0.0',
  description: 'A LangChain-powered AI agent with OpenAI and Google Gemini support',
  capabilities: [
    'chat',
    'search',
    'langchain-integration'
  ],
  providers: [
    'openai',
    'google-gemini'
  ],
  type: 'conversational-agent',
  framework: 'langchain',
  runtime: 'node.js'
};

// Create MCP server instance
const server = new Server(
  {
    name: 'my-first-agent-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_agent_info',
        description: 'Get information about this agent including capabilities and configuration',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'health_check',
        description: 'Check if the agent is healthy and operational',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_agent_info':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(AGENT_INFO, null, 2),
          },
        ],
      };

    case 'health_check':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'healthy',
              timestamp: new Date().toISOString(),
              uptime: process.uptime(),
            }, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Handler for listing available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'agent://info',
        name: 'Agent Information',
        description: 'Complete agent metadata and capabilities',
        mimeType: 'application/json',
      },
      {
        uri: 'agent://config',
        name: 'Agent Configuration',
        description: 'Agent configuration and settings',
        mimeType: 'application/json',
      },
    ],
  };
});

/**
 * Handler for reading resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'agent://info':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(AGENT_INFO, null, 2),
          },
        ],
      };

    case 'agent://config':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              framework: 'langchain',
              server: {
                port: process.env.PORT || 4000,
                host: '0.0.0.0',
              },
              providers: {
                gemini: {
                  enabled: !!process.env.GOOGLE_API_KEY,
                  model: 'gemini-2.0-flash',
                },
                openai: {
                  enabled: !!process.env.OPENAI_API_KEY,
                },
              },
            }, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP Server started successfully');
  console.error(`Agent: ${AGENT_INFO.name} v${AGENT_INFO.version}`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
