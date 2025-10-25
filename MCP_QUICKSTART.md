# MCP Server Quick Start Guide

This guide will help you get started with the Model Context Protocol (MCP) server.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). This enables better integration between AI agents and various tools, data sources, and services.

## Quick Start

### 1. Install Dependencies

The MCP server dependencies are automatically installed with the project:

```bash
npm install
```

### 2. Start the MCP Server

```bash
npm run mcp
```

The server will start in stdio mode, listening for MCP protocol messages on stdin/stdout.

### 3. Connect from an MCP Client

To connect this MCP server to an MCP client (like Claude Desktop):

1. Locate your MCP client configuration file:
   - **Claude Desktop (macOS)**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Claude Desktop (Windows)**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the server configuration:

```json
{
  "mcpServers": {
    "my-first-agent": {
      "command": "node",
      "args": ["/absolute/path/to/my-first-agent/src/mcp-server/index.js"],
      "env": {
        "GOOGLE_API_KEY": "your-key-here",
        "OPENAI_API_KEY": "your-key-here"
      }
    }
  }
}
```

3. Restart your MCP client

## Available Tools

Once connected, the MCP server provides these tools:

### `get_agent_info`
Returns comprehensive information about the agent including:
- Name and version
- Capabilities
- Supported providers
- Framework details

**Usage:**
```
Use the get_agent_info tool to see details about my-first-agent
```

### `get_company_info`
Returns company/organization information including:
- Company overview
- Contact details (GitHub, email)
- Focus areas and specializations
- Technology stack
- Mission statement

**Usage:**
```
Use the get_company_info tool to get information about KeliLabs
```

### `get_full_profile`
Returns complete profile combining both agent and company information.

**Usage:**
```
Use the get_full_profile tool to get the complete profile
```

### `health_check`
Checks if the agent is healthy and operational.

**Usage:**
```
Use the health_check tool to verify the agent is running properly
```

## Available Resources

The server also exposes these resources:

### `agent://info`
Complete agent metadata and capabilities (JSON format)

### `agent://config`
Current agent configuration and settings (JSON format)

### `company://info`
Company/organization details including overview, contact info, focus areas, and technology stack (JSON format)

### `company://profile`
Complete profile combining agent and company information (JSON format)

## Development

### Watch Mode
For development with auto-reload:

```bash
npm run mcp:dev
```

### Testing
Test the server manually:

```bash
# Start the server
npm run mcp

# In another terminal, send a test message:
echo '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}' | npm run mcp
```

## Integration Examples

### Example: Claude Desktop

After adding the configuration above, you can interact with the agent:

```
@my-first-agent What are your capabilities?
```

Claude will use the MCP server to get agent information.

### Example: Custom MCP Client

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['src/mcp-server/index.js']
});

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log('Available tools:', tools);

// Call a tool
const result = await client.callTool({
  name: 'get_agent_info'
});
console.log('Agent info:', result);
```

## Troubleshooting

### Server won't start
- Check that Node.js v18+ is installed: `node --version`
- Verify dependencies are installed: `npm install`
- Check for syntax errors: `node --check src/mcp-server/index.js`

### Client can't connect
- Verify the absolute path to `index.js` is correct
- Check that environment variables are set correctly
- Look for errors in the MCP client logs

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Agent Registry (NANDA)](https://github.com/aidecentralized/hackathon)

## Support

For issues or questions, please open an issue in the GitHub repository.
