# Deployment Guide for Heroku

This guide provides step-by-step instructions for deploying the my-first-agent application to Heroku.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- A Heroku account ([sign up here](https://signup.heroku.com/))
- Git installed and configured
- Google Gemini API key ([get one here](https://ai.google.dev/))

## One-Click Deploy

The quickest way to deploy is using the Heroku Deploy button:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This will:
1. Create a new Heroku app
2. Prompt you for required environment variables
3. Deploy the application automatically

## Manual Deployment

### Step 1: Login to Heroku

```bash
heroku login
```

### Step 2: Create a New Heroku App

```bash
heroku create your-app-name
```

Or let Heroku generate a random name:

```bash
heroku create
```

Note the app URL provided (e.g., `https://your-app-name.herokuapp.com`).

### Step 3: Configure Environment Variables

**Required:**

```bash
heroku config:set GOOGLE_API_KEY=your_google_gemini_api_key
```

**Optional but recommended:**

```bash
# For OpenAI support
heroku config:set OPENAI_API_KEY=your_openai_api_key

# For search functionality
heroku config:set SERPAPI_API_KEY=your_serpapi_key
heroku config:set SEARCHAPI_API_KEY=your_searchapi_key

# For LangSmith tracing
heroku config:set LANGSMITH_API_KEY=your_langsmith_key
heroku config:set LANGSMITH_PROJECT=my-first-agent
heroku config:set LANGSMITH_TRACING=true

# Set production environment
heroku config:set NODE_ENV=production
```

### Step 4: Deploy the Application

```bash
git push heroku main
```

If you're deploying from a different branch:

```bash
git push heroku your-branch-name:main
```

### Step 5: Verify Deployment

Wait for the build to complete. Once done, open the app:

```bash
heroku open
```

Or visit manually: `https://your-app-name.herokuapp.com`

### Step 6: Validate Endpoints

Test the deployed endpoints:

**Health Check:**
```bash
curl https://your-app-name.herokuapp.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-25T...",
  "uptime": 123.45,
  "environment": "production",
  "providers": {
    "gemini": true,
    "openai": false
  }
}
```

**MCP Information:**
```bash
curl https://your-app-name.herokuapp.com/mcp
```

Expected response includes agent metadata, capabilities, and endpoints.

**Chat API:**
```bash
curl -X POST https://your-app-name.herokuapp.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

Expected response:
```json
{
  "response": "AI-generated response..."
}
```

## Public Endpoints

Your deployed application exposes the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web interface for chatting with the AI agent |
| `/chat` | POST | Programmatic chat interactions |
| `/health` | GET | Health check and status information |
| `/mcp` | GET | MCP protocol information and agent metadata |

## MCP Server Integration

The stdio-based MCP server (`src/mcp-server/index.js`) is designed for local MCP client integration (e.g., Claude Desktop). For public web-based access, use the HTTP endpoints above.

### NANDA Registry Integration

To register this agent with NANDA or other agent registries:

1. **Agent Information URL**: `https://your-app-name.herokuapp.com/mcp`
2. **Health Check URL**: `https://your-app-name.herokuapp.com/health`
3. **Chat API URL**: `https://your-app-name.herokuapp.com/chat`

The `/mcp` endpoint provides all necessary metadata for agent discovery:
- Agent name, version, and description
- Capabilities and providers
- Company information
- Available endpoints

## Monitoring and Logs

### View Logs

```bash
heroku logs --tail
```

### View App Info

```bash
heroku apps:info
```

### View Configuration

```bash
heroku config
```

## Scaling

### Scale Dynos

```bash
# Scale to multiple web dynos
heroku ps:scale web=2

# Scale to a different dyno type
heroku ps:resize web=standard-1x
```

## Troubleshooting

### Build Failures

**Issue**: Build fails during npm install

**Solution**: 
- Check that all dependencies in `package.json` are valid
- Review build logs: `heroku logs --tail`
- Clear build cache: `heroku plugins:install heroku-builds && heroku builds:cache:purge`

### Application Errors

**Issue**: Application crashes on startup

**Solution**:
- Check logs: `heroku logs --tail`
- Verify GOOGLE_API_KEY is set: `heroku config:get GOOGLE_API_KEY`
- Restart the app: `heroku restart`

### Chat Endpoint Returns 500 Error

**Issue**: `/chat` endpoint returns "Google API key not configured"

**Solution**:
```bash
heroku config:set GOOGLE_API_KEY=your_actual_api_key
heroku restart
```

### Health Check Fails

**Issue**: `/health` endpoint not responding

**Solution**:
- Check if the app is running: `heroku ps`
- Review logs for startup errors: `heroku logs --tail`
- Verify PORT is not hardcoded (should use `process.env.PORT`)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google Gemini API key |
| `OPENAI_API_KEY` | No | OpenAI API key for GPT models |
| `SERPAPI_API_KEY` | No | SerpAPI key for search |
| `SEARCHAPI_API_KEY` | No | SearchAPI key for news search |
| `LANGSMITH_API_KEY` | No | LangSmith API key for tracing |
| `LANGSMITH_PROJECT` | No | LangSmith project name |
| `LANGSMITH_TRACING` | No | Enable tracing (true/false) |
| `NODE_ENV` | No | Node environment (set to `production`) |
| `PORT` | Auto | Port number (automatically set by Heroku) |

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** regularly
3. **Use Heroku Config Vars** for all secrets
4. **Enable HTTPS** (automatic on Heroku)
5. **Review access logs** periodically

## Additional Resources

- [Heroku Node.js Documentation](https://devcenter.heroku.com/categories/nodejs-support)
- [Heroku Configuration and Config Vars](https://devcenter.heroku.com/articles/config-vars)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [LangChain Documentation](https://js.langchain.com/docs/)

## Support

For issues or questions:
- GitHub Issues: https://github.com/KeliLabs/my-first-agent/issues
- Email: contact@kelilabs.com
