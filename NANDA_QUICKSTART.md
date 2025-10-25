# Quick Reference: NANDA Registration

This is a condensed quick reference for registering your MCP agent with NANDA. For detailed instructions, see [NANDA_REGISTRATION.md](NANDA_REGISTRATION.md).

## TL;DR - 5 Minute Registration

### 1. Deploy Your Agent (if not already deployed)

```bash
# One-click deploy to Heroku
# Visit: https://heroku.com/deploy (using the button in README.md)
# OR manual deploy:
heroku create
heroku config:set GOOGLE_API_KEY=your_key
git push heroku main
```

### 2. Verify Your Endpoints

```bash
# Replace with your actual Heroku URL
export APP_URL="https://your-app-url.herokuapp.com"

curl $APP_URL/health    # Should return {"status": "healthy", ...}
curl $APP_URL/mcp       # Should return agent metadata
```

### 3. Register with NANDA

1. Visit: **https://nanda.media.mit.edu**
2. Find "Register Agent" or "Add Agent"
3. Submit these details:

| Field | Value |
|-------|-------|
| Endpoint URL | `https://your-app-url.herokuapp.com/mcp` |
| Agent Name | `my-first-agent` |
| Description | A LangChain-powered AI agent with OpenAI and Google Gemini support |
| Contact | `contact@kelilabs.com` |

### 4. Verify Registration

- Search for your agent in NANDA registry
- Confirm it's discoverable and queryable

### 5. Document Your Registration

Add to your repo (e.g., in this file or README):

```markdown
**NANDA Registration**
- Registry URL: https://nanda.media.mit.edu/agents/my-first-agent
- Registered: YYYY-MM-DD
- Status: Active
```

## Essential Information to Copy-Paste

### Your MCP Endpoint URL
```
https://your-app-url.herokuapp.com/mcp
```

### Agent Description
```
A LangChain-powered AI agent with OpenAI and Google Gemini support
```

### Capabilities
```
chat, search, langchain-integration
```

### Focus Areas
```
AI Agent Development
LangChain Integration
Model Context Protocol (MCP) Implementation
Multi-Provider AI Support
Conversational AI
Agent Interoperability
```

### Technology Stack
```
Frameworks: LangChain, Express.js
Languages: JavaScript, Python
AI Providers: OpenAI, Google Gemini
Protocol: Model Context Protocol (MCP)
```

### Contact Information
```
Organization: KeliLabs
Email: contact@kelilabs.com
GitHub: https://github.com/KeliLabs
Repository: https://github.com/KeliLabs/my-first-agent
```

## Complete Agent Metadata (JSON)

Get this from your deployed endpoint:
```bash
curl https://your-app-url.herokuapp.com/mcp | python3 -m json.tool
```

Or use this template:
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
    "overview": "KeliLabs is dedicated to building innovative AI agents and tools that enable agentic interoperability and enhance the AI ecosystem.",
    "focus_areas": [
      "AI Agent Development",
      "LangChain Integration",
      "Model Context Protocol (MCP) Implementation",
      "Multi-Provider AI Support",
      "Conversational AI",
      "Agent Interoperability"
    ],
    "contact": {
      "github": "https://github.com/KeliLabs",
      "repository": "https://github.com/KeliLabs/my-first-agent",
      "email": "contact@kelilabs.com"
    },
    "technology_stack": {
      "frameworks": ["LangChain", "Express.js"],
      "languages": ["JavaScript", "Python"],
      "ai_providers": ["OpenAI", "Google Gemini"],
      "protocols": ["Model Context Protocol (MCP)"]
    },
    "mission": "To democratize AI agent development and foster interoperability across the AI agent ecosystem"
  },
  "endpoints": {
    "chat": "/chat",
    "health": "/health",
    "mcp": "/mcp"
  }
}
```

## Common Issues & Quick Fixes

### Issue: Can't access my deployed app
```bash
# Check if app is running
heroku ps

# Wake up app (if on free tier)
curl https://your-app-url.herokuapp.com/health

# Check logs
heroku logs --tail
```

### Issue: /mcp endpoint returns error
```bash
# Check environment variables
heroku config

# Verify API key is set
heroku config:get GOOGLE_API_KEY

# Restart app
heroku restart
```

### Issue: Registration not showing in NANDA
- Wait 24-48 hours for approval/indexing
- Verify your endpoint is publicly accessible
- Check email for confirmation requests

## Next Steps After Registration

1. ✅ Monitor your endpoint uptime
2. ✅ Keep agent metadata up-to-date
3. ✅ Update registry when deploying new versions
4. ✅ Respond to any verification emails from NANDA

## Resources

- 📋 **Full Checklist**: [NANDA_REGISTRATION.md](NANDA_REGISTRATION.md)
- 🚀 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📖 **Main README**: [README.md](README.md)
- 🔧 **HTTP MCP Endpoint Code**: [server.js](server.js) (lines 62-107)
- 🔧 **Standalone MCP Server**: [src/mcp-server/index.js](src/mcp-server/index.js)

---

**Quick Links:**
- NANDA Registry: https://nanda.media.mit.edu
- MCP Protocol Docs: https://modelcontextprotocol.io/
- Your MCP Endpoint: `https://your-app-url.herokuapp.com/mcp`
