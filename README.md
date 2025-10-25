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

- `OPENAI_API_KEY` - Your OpenAI API key
- `LANGCHAIN_TRACING_V2` - Enable LangChain tracing
- `LANGCHAIN_API_KEY` - Your LangChain API key (optional)
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

This application is configured for deployment on Heroku.

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
