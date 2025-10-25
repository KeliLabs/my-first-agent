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

// Company/Organization information
const COMPANY_INFO = {
  name: 'KeliLabs',
  overview: 'KeliLabs is dedicated to building innovative AI agents and tools that enable agentic interoperability and enhance the AI ecosystem.',
  focus_areas: [
    'AI Agent Development',
    'LangChain Integration',
    'Model Context Protocol (MCP) Implementation',
    'Multi-Provider AI Support',
    'Conversational AI',
    'Agent Interoperability'
  ],
  contact: {
    github: 'https://github.com/KeliLabs',
    repository: 'https://github.com/KeliLabs/my-first-agent',
    email: 'contact@kelilabs.com'
  },
  technology_stack: {
    frameworks: ['LangChain', 'Express.js'],
    languages: ['JavaScript', 'Python'],
    ai_providers: ['OpenAI', 'Google Gemini'],
    protocols: ['Model Context Protocol (MCP)']
  },
  mission: 'To democratize AI agent development and foster interoperability across the AI agent ecosystem'
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
        name: 'get_company_info',
        description: 'Get information about the company/organization behind this agent, including overview, contact details, and focus areas',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_full_profile',
        description: 'Get complete profile including both agent and company information',
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

    case 'get_company_info':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(COMPANY_INFO, null, 2),
          },
        ],
      };

    case 'get_full_profile':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              agent: AGENT_INFO,
              company: COMPANY_INFO,
              timestamp: new Date().toISOString(),
            }, null, 2),
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
      {
        uri: 'company://info',
        name: 'Company Information',
        description: 'Company/organization details, contact info, and focus areas',
        mimeType: 'application/json',
      },
      {
        uri: 'company://profile',
        name: 'Complete Profile',
        description: 'Combined agent and company information',
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

    case 'company://info':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(COMPANY_INFO, null, 2),
          },
        ],
      };

    case 'company://profile':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              agent: AGENT_INFO,
              company: COMPANY_INFO,
              timestamp: new Date().toISOString(),
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
