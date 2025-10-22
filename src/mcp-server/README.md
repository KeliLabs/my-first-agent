# MCP Server for Agent Interoperability

This directory contains the Model Context Protocol (MCP) server implementation for the my-first-agent project.

## Overview

The MCP server exposes agent information and capabilities following the Model Context Protocol specification. This enables agentic interoperability and registration with systems like NANDA (Network of Autonomous and Distributed Agents).

## Features

- **Tools**: Expose agent capabilities as callable tools
  - `get_agent_info`: Returns comprehensive agent metadata
  - `health_check`: Returns agent health status

- **Resources**: Provide access to agent configuration and state
  - `agent://info`: Agent metadata and capabilities
  - `agent://config`: Agent configuration and settings

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

### Example Tool Call

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

### Example Resource Read

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

## Agent Information

The server exposes the following agent metadata:

- **Name**: my-first-agent
- **Version**: 1.0.0
- **Type**: conversational-agent
- **Framework**: LangChain
- **Capabilities**: chat, search, langchain-integration
- **Providers**: OpenAI, Google Gemini

## Integration

This MCP server can be integrated with:

- MCP clients (Claude Desktop, etc.)
- Agent registries (NANDA)
- Other MCP-compatible tools and platforms

## References

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [aidecentralized/hackathon](https://github.com/aidecentralized/hackathon) - MCP examples
