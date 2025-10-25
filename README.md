# LangChain Hello World

A simple LangChain application running in a GitHub Codespace, demonstrating basic AI chat functionality.

## Features

- 🦜 LangChain integration with OpenAI
- 🌐 Express.js web server
- 💬 Interactive chat interface
- 🐍 Python support for advanced LangChain features
- 📊 Jupyter notebook support
- 🔧 Pre-configured dev container
- 🤖 MCP (Model Context Protocol) server for agent interoperability
- 🔍 NANDA registry integration for agentic discovery

## Getting Started

1. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key.

2. **Install dependencies:**

   ```bash
   npm install
   pip3 install -r requirements.txt
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

4. **Visit the application:**

   Open your browser to `http://localhost:4000`

## MCP Server

The project includes a Model Context Protocol (MCP) server for agent interoperability and discovery.

**Quick start:**

```bash
npm run mcp
```

The MCP server exposes comprehensive agent and company information for integration with:
- MCP clients (Claude Desktop, etc.)
- Agent registries (e.g., [NANDA](https://nanda.media.mit.edu))
- Other AI agents and tools

**Available Information:**
- Agent capabilities and technical details
- Company overview and mission
- Contact information
- Focus areas and specializations
- Technology stack

**Agent Registry Integration:**
- See the [NANDA Registry Registration](#nanda-registry-registration) section for step-by-step instructions on registering your agent for public discovery
- The `/mcp` endpoint provides all required information for registry submission

For detailed setup and usage instructions, see [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

## Development

### Node.js Development

- `npm run dev` - Start with nodemon for auto-reload
- `npm start` - Start the production server

### MCP Server

- `npm run mcp` - Start the MCP server for agent interoperability
- `npm run mcp:dev` - Start MCP server with auto-reload

The MCP server exposes agent and company information following the Model Context Protocol. It provides:
- **Tools**: `get_agent_info`, `get_company_info`, `get_full_profile`, `health_check`
- **Resources**: `agent://info`, `agent://config`, `company://info`, `company://profile`

See [src/mcp-server/README.md](src/mcp-server/README.md) for more details.

### Python Development

- Use the integrated Jupyter notebook support
- Python dependencies are automatically installed
- LangChain tracing is enabled by default

## Environment Variables

**Required:**
- `GOOGLE_API_KEY` - Your Google Gemini API key (required for chat functionality)

**Optional:**
- `OPENAI_API_KEY` - Your OpenAI API key (for OpenAI provider support)
- `SERPAPI_API_KEY` - SerpAPI key for search functionality
- `SEARCHAPI_API_KEY` - SearchAPI key for news search
- `LANGCHAIN_TRACING_V2` - Enable LangChain tracing
- `LANGCHAIN_API_KEY` - Your LangChain API key
- `LANGCHAIN_PROJECT` - Project name for tracing

## Project Structure

```text
├── .devcontainer/          # Dev container configuration
├── src/
│   └── mcp-server/        # MCP server for agent interoperability
│       ├── index.js       # MCP server implementation
│       └── README.md      # MCP server documentation
├── server.js               # Main Express server
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── DEPLOYMENT.md          # Heroku deployment guide
├── NANDA_REGISTRATION.md  # NANDA registry registration checklist
└── README.md             # This file
```

## LangChain Examples

This project includes examples for:

- Basic chat completion
- System message configuration
- Error handling
- Response parsing

## Deployment

### Heroku Deployment

This application is configured for deployment on Heroku. For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

#### Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- A Heroku account
- Google Gemini API key (required)

#### Quick Deploy

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Click the button above to deploy directly to Heroku. You will be prompted to enter your environment variables.

#### Manual Deployment

1. **Create a Heroku app:**

   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**

   ```bash
   heroku config:set GOOGLE_API_KEY=your_google_api_key
   heroku config:set NODE_ENV=production
   ```

   Optional environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set SERPAPI_API_KEY=your_serpapi_key
   heroku config:set SEARCHAPI_API_KEY=your_searchapi_key
   heroku config:set LANGSMITH_API_KEY=your_langsmith_key
   heroku config:set LANGSMITH_PROJECT=your_project_name
   ```

3. **Deploy the application:**

   ```bash
   git push heroku main
   ```

4. **Open the application:**

   ```bash
   heroku open
   ```

#### Public Endpoints

Once deployed, your application will have the following publicly accessible endpoints:

- **`/`** - Web interface for chatting with the AI agent
- **`/chat`** - POST endpoint for programmatic chat interactions
  - Request body: `{ "message": "your message", "provider": "gemini" }`
  - Response: `{ "response": "AI response" }`
- **`/health`** - Health check endpoint
  - Returns server status, uptime, and configured providers
- **`/mcp`** - MCP (Model Context Protocol) information endpoint
  - Returns agent metadata, capabilities, and available endpoints

#### Example Usage

**Health Check:**
```bash
curl https://your-app-url.herokuapp.com/health
```

**MCP Information:**
```bash
curl https://your-app-url.herokuapp.com/mcp
```

**Chat API:**
```bash
curl -X POST https://your-app-url.herokuapp.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

#### Validation

After deployment, validate that:
1. The health check endpoint returns `{ "status": "healthy" }`
2. The MCP endpoint returns agent and company information
3. The chat endpoint responds with AI-generated messages
4. The web interface is accessible and functional

#### Troubleshooting

- **500 Error on `/chat`**: Ensure `GOOGLE_API_KEY` is set in your Heroku config
- **Application Error**: Check logs with `heroku logs --tail`
- **Build Failure**: Verify all dependencies are listed in `package.json`

## NANDA Registry Registration

The NANDA registry (https://nanda.media.mit.edu) is a centralized registry for AI agents that enables agentic web discovery and interoperability. Registering your MCP agent makes it discoverable by other AI agents and tools in the ecosystem.

> **📋 Quick Start**: Use our [NANDA Registration Checklist](NANDA_REGISTRATION.md) for a step-by-step guided process.

### Prerequisites

Before registering with NANDA, ensure you have:

1. **Deployed your MCP server** to a publicly accessible URL (e.g., Heroku, as described above)
2. **Verified your endpoints** are working correctly:
   - Test `/mcp` endpoint: `curl https://your-app-url.herokuapp.com/mcp`
   - Test `/health` endpoint: `curl https://your-app-url.herokuapp.com/health`
3. **Gathered required information** (see below)

### Registration Process

#### Step 1: Gather Your Agent Information

Your deployed MCP server provides all necessary information via the `/mcp` endpoint. Retrieve it with:

```bash
curl https://your-app-url.herokuapp.com/mcp
```

This returns:

```json
{
  "name": "my-first-agent-mcp-server",
  "version": "1.0.0",
  "protocol": "Model Context Protocol (MCP)",
  "agent": {
    "name": "my-first-agent",
    "version": "1.0.0",
    "description": "A LangChain-powered AI agent with OpenAI and Google Gemini support",
    "capabilities": ["chat", "search", "langchain-integration"],
    "providers": ["openai", "google-gemini"],
    "type": "conversational-agent",
    "framework": "langchain",
    "runtime": "node.js"
  },
  "company": {
    "name": "KeliLabs",
    "repository": "https://github.com/KeliLabs/my-first-agent",
    "contact": "contact@kelilabs.com"
  },
  "endpoints": {
    "chat": "/chat",
    "health": "/health",
    "mcp": "/mcp"
  }
}
```

#### Step 2: Visit NANDA Registry

1. Navigate to **https://nanda.media.mit.edu**
2. Look for the "Register Agent" or "Add Agent" option
3. Follow the registration form or submission process

#### Step 3: Submit Agent Details

Based on the NANDA registry requirements, prepare to submit the following information:

| Field | Value | Source |
|-------|-------|--------|
| **Endpoint URL** | `https://your-app-url.herokuapp.com/mcp` | Your deployed MCP endpoint |
| **Agent Name** | `my-first-agent` | From `/mcp` response |
| **Agent Version** | `1.0.0` | From `/mcp` response |
| **Overview/Description** | A LangChain-powered AI agent with OpenAI and Google Gemini support | From `/mcp` response |
| **Contact Email** | `contact@kelilabs.com` | From `/mcp` response |
| **Repository** | `https://github.com/KeliLabs/my-first-agent` | From `/mcp` response |
| **Protocol** | Model Context Protocol (MCP) | From `/mcp` response |
| **Agent Type** | conversational-agent | From `/mcp` response |
| **Capabilities** | chat, search, langchain-integration | From `/mcp` response |
| **Focus Areas** | - AI Agent Development<br>- LangChain Integration<br>- Multi-Provider AI Support<br>- Conversational AI<br>- Agent Interoperability | Based on agent capabilities |
| **Technology Stack** | LangChain, Express.js, OpenAI, Google Gemini, Node.js | From `/mcp` response and agent configuration |

#### Step 4: Verify Registration

After submitting your registration:

1. **Check registry listing**: Search for your agent in the NANDA registry
2. **Test discoverability**: Verify your agent appears in search results
3. **Validate endpoint**: Ensure the registry correctly links to your `/mcp` endpoint
4. **Test queries**: If NANDA provides query functionality, test that your agent responds correctly

Example verification:

```bash
# Verify your MCP endpoint is accessible
curl https://your-app-url.herokuapp.com/mcp

# Check health status
curl https://your-app-url.herokuapp.com/health

# Test chat functionality
curl -X POST https://your-app-url.herokuapp.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I am testing the agent registration"}'
```

#### Step 5: Document Your Registration

Once registered, document your agent's NANDA registry details:

1. **Registry URL**: The public URL where your agent is listed in NANDA
2. **Registration Date**: When you completed the registration
3. **Registry ID/Handle**: Any unique identifier assigned by NANDA

Example documentation (add to your repository):

```markdown
### NANDA Registry Information

- **Registry URL**: https://nanda.media.mit.edu/agents/my-first-agent
- **Registered**: 2024-01-XX
- **Status**: Active
- **Endpoint**: https://your-app-url.herokuapp.com/mcp
```

### Maintaining Your Registration

To keep your agent registration current:

1. **Update endpoint information** if your deployment URL changes
2. **Update agent metadata** when you add new capabilities or features
3. **Monitor endpoint availability** to ensure 24/7 uptime for agent discovery
4. **Keep contact information current** for registry maintainers to reach you
5. **Version your agent appropriately** and update the registry when releasing new versions

### Troubleshooting Registration

**Issue: MCP endpoint not accessible**
- Verify your Heroku app is running: `heroku ps`
- Check application logs: `heroku logs --tail`
- Test endpoint directly: `curl https://your-app-url.herokuapp.com/mcp`

**Issue: Agent not appearing in registry**
- Verify registration was submitted successfully
- Check if NANDA has moderation/approval process
- Ensure your endpoint returns valid JSON
- Verify your endpoint is publicly accessible (not behind authentication)

**Issue: Registration information incorrect**
- Most registries allow updating agent information
- Use the NANDA registry update/edit functionality
- Verify your `/mcp` endpoint returns current information

### Additional Resources

- **NANDA Registration Checklist**: [NANDA_REGISTRATION.md](NANDA_REGISTRATION.md) - Complete step-by-step registration guide
- **NANDA Registry**: https://nanda.media.mit.edu
- **MCP Protocol Documentation**: https://modelcontextprotocol.io/
- **Agent Registry Best Practices**: Ensure 99.9% uptime for your MCP endpoint
- **MCP Server Code**: See `src/mcp-server/index.js` for implementation details
- **Agent Metadata**: Modify `src/mcp-server/index.js` to update agent information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
