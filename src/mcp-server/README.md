# MCP Server for Agent Interoperability

This directory contains the Model Context Protocol (MCP) server implementation for the my-first-agent project.

## Overview

The MCP server exposes agent information and capabilities following the Model Context Protocol specification. This enables agentic interoperability and registration with systems like NANDA (Network of Autonomous and Distributed Agents).

## Features

### Tools
The server exposes agent and company capabilities as callable tools:

- **`get_agent_info`**: Returns comprehensive agent metadata including capabilities, providers, and technical details
- **`get_company_info`**: Returns company/organization information including overview, contact details, and focus areas
- **`get_full_profile`**: Returns complete profile with both agent and company information
- **`health_check`**: Returns agent health status and uptime

### Resources
The server provides access to agent and company information through structured resources:

- **`agent://info`**: Agent metadata and capabilities (JSON)
- **`agent://config`**: Agent configuration and settings (JSON)
- **`company://info`**: Company/organization details, contact info, and focus areas (JSON)
- **`company://profile`**: Complete profile combining agent and company information (JSON)

## Agent Information

The server exposes the following agent metadata:

- **Name**: my-first-agent
- **Version**: 1.0.0
- **Type**: conversational-agent
- **Framework**: LangChain
- **Capabilities**: chat, search, langchain-integration
- **Providers**: OpenAI, Google Gemini

## Company Information

The server exposes the following company/organization details:

- **Name**: KeliLabs
- **Overview**: Building innovative AI agents and tools for agentic interoperability
- **Focus Areas**:
  - AI Agent Development
  - LangChain Integration
  - Model Context Protocol (MCP) Implementation
  - Multi-Provider AI Support
  - Conversational AI
  - Agent Interoperability
- **Contact**:
  - GitHub: https://github.com/KeliLabs
  - Repository: https://github.com/KeliLabs/my-first-agent
  - Email: contact@kelilabs.com
- **Technology Stack**:
  - Frameworks: LangChain, Express.js
  - Languages: JavaScript, Python
  - AI Providers: OpenAI, Google Gemini
  - Protocols: Model Context Protocol (MCP)

## Running the MCP Server

### Start the server

```bash
npm run mcp
```

### Development mode (with auto-reload)

```bash
npm run mcp:dev
```

## MCP Protocol

The server implements the Model Context Protocol using stdio transport. It communicates via standard input/output using JSON-RPC messages.

### Example Tool Calls

#### Get Agent Information
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_agent_info"
  },
  "id": 1
}
```

#### Get Company Information
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_company_info"
  },
  "id": 2
}
```

#### Get Full Profile
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_full_profile"
  },
  "id": 3
}
```

### Example Resource Reads

#### Read Agent Info
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "agent://info"
  },
  "id": 1
}
```

#### Read Company Info
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "company://info"
  },
  "id": 2
}
```

## Integration

This MCP server can be integrated with:

- MCP clients (Claude Desktop, etc.)
- Agent registries (NANDA: https://nanda.media.mit.edu)
- Other MCP-compatible tools and platforms

### Registry Integration (NANDA)

The server exposes all necessary information for agent discovery and registry integration:
- Agent overview and capabilities
- Company/organization details
- Contact information
- Focus areas and specializations
- Technology stack

All information is provided in machine-readable JSON format, making it easy for registries and other agents to discover and interact with this agent.

## References

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [aidecentralized/hackathon](https://github.com/aidecentralized/hackathon) - MCP examples
- [NANDA Registry](https://nanda.media.mit.edu) - Network of Autonomous and Distributed Agents
