# NANDA Registry Registration Checklist

This document provides a step-by-step checklist for registering your MCP agent with the NANDA registry.

## Pre-Registration Checklist

Before starting the registration process, ensure you have completed the following:

- [ ] **Deploy your MCP server** to a publicly accessible URL
  - Recommended: Use Heroku deployment (see [DEPLOYMENT.md](DEPLOYMENT.md))
  - Alternative: Any cloud platform with public HTTP access
  
- [ ] **Verify your deployment** is working correctly:
  ```bash
  # Test health endpoint
  curl https://your-app-url.herokuapp.com/health
  
  # Test MCP endpoint
  curl https://your-app-url.herokuapp.com/mcp
  
  # Test chat endpoint
  curl -X POST https://your-app-url.herokuapp.com/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello, testing registration"}'
  ```

- [ ] **Gather required information** from your `/mcp` endpoint:
  ```bash
  curl https://your-app-url.herokuapp.com/mcp > agent-info.json
  ```

## Registration Process

### Step 1: Access NANDA Registry

- [ ] Navigate to [https://nanda.media.mit.edu](https://nanda.media.mit.edu)
- [ ] Look for "Register Agent", "Add Agent", or similar option
- [ ] Create an account if required

### Step 2: Prepare Agent Information

Use the information from your `/mcp` endpoint response. Copy the following details:

- [ ] **Agent Name**: `my-first-agent`
- [ ] **Agent Version**: `1.0.0`
- [ ] **MCP Endpoint URL**: `https://your-app-url.herokuapp.com/mcp`
- [ ] **Description**: "A LangChain-powered AI agent with OpenAI and Google Gemini support"
- [ ] **Protocol**: "Model Context Protocol (MCP)"
- [ ] **Agent Type**: `conversational-agent`

### Step 3: Prepare Company/Organization Information

- [ ] **Organization Name**: `KeliLabs`
- [ ] **Contact Email**: `contact@kelilabs.com`
- [ ] **GitHub Organization**: `https://github.com/KeliLabs`
- [ ] **Repository URL**: `https://github.com/KeliLabs/my-first-agent`
- [ ] **Mission Statement**: "To democratize AI agent development and foster interoperability across the AI agent ecosystem"

### Step 4: Specify Capabilities and Focus Areas

**Capabilities** (from `/mcp` endpoint):
- [ ] chat
- [ ] search
- [ ] langchain-integration

**Focus Areas**:
- [ ] AI Agent Development
- [ ] LangChain Integration
- [ ] Model Context Protocol (MCP) Implementation
- [ ] Multi-Provider AI Support
- [ ] Conversational AI
- [ ] Agent Interoperability

**Technology Stack**:
- [ ] Frameworks: LangChain, Express.js
- [ ] Languages: JavaScript, Python
- [ ] AI Providers: OpenAI, Google Gemini
- [ ] Protocols: Model Context Protocol (MCP)

**Providers**:
- [ ] openai
- [ ] google-gemini

### Step 5: Submit Registration

- [ ] Fill out all required fields in the NANDA registration form
- [ ] Double-check all URLs are correct and publicly accessible
- [ ] Review submission for accuracy
- [ ] Submit registration
- [ ] Save confirmation/receipt if provided

## Post-Registration Verification

### Step 1: Verify Registry Listing

- [ ] Search for your agent in the NANDA registry
- [ ] Confirm your agent appears in search results
- [ ] Verify all displayed information is correct

### Step 2: Test Agent Discoverability

- [ ] Test that the registry correctly links to your `/mcp` endpoint
- [ ] Verify your agent is queryable through the registry (if applicable)
- [ ] Check that your agent metadata is displayed correctly

### Step 3: Verify Endpoint Accessibility

Confirm your endpoints are accessible from external sources:

```bash
# From a different machine/network:
curl https://your-app-url.herokuapp.com/mcp
curl https://your-app-url.herokuapp.com/health
```

Expected responses:
- [ ] `/mcp` returns valid JSON with agent metadata
- [ ] `/health` returns `{"status": "healthy", ...}`
- [ ] Response time is reasonable (< 2 seconds)
- [ ] No authentication errors
- [ ] No SSL/TLS errors

### Step 4: Document Your Registration

Once successfully registered, document the following in your repository:

- [ ] **Registry URL**: _____________________________________
  - Example: `https://nanda.media.mit.edu/agents/my-first-agent`

- [ ] **Registration Date**: _____________________________________
  - Example: `2024-01-15`

- [ ] **Status**: Active / Under Review / Pending

- [ ] **Registry ID or Handle** (if applicable): _____________________________________

- [ ] **Verification Method Used**: _____________________________________

## Ongoing Maintenance

After registration, maintain your agent listing:

### Regular Checks
- [ ] **Weekly**: Verify your MCP endpoint is accessible
  ```bash
  curl https://your-app-url.herokuapp.com/health
  ```

- [ ] **Monthly**: Review and update agent metadata if capabilities change
- [ ] **On Deploy**: Update registry if your endpoint URL changes
- [ ] **On Update**: Update version number in registry when releasing new versions

### Update Procedures

When you need to update your registration:

- [ ] Update agent metadata in `src/mcp-server/index.js`
- [ ] Update company information in `server.js` `/mcp` endpoint
- [ ] Deploy changes to Heroku
- [ ] Verify changes are reflected in `/mcp` endpoint
- [ ] Update registry listing (if NANDA provides update functionality)

## Troubleshooting

### Issue: Registration Rejected

**Possible causes:**
- [ ] MCP endpoint not accessible
- [ ] Invalid endpoint URL format
- [ ] Missing required fields
- [ ] Duplicate agent name

**Solutions:**
- Verify endpoint is publicly accessible: `curl https://your-app-url.herokuapp.com/mcp`
- Check Heroku app is running: `heroku ps`
- Review error messages from NANDA
- Contact NANDA support if needed

### Issue: Agent Not Appearing in Registry

**Possible causes:**
- [ ] Registration pending approval
- [ ] Moderation queue delay
- [ ] Search indexing delay

**Solutions:**
- Wait 24-48 hours for approval/indexing
- Check email for confirmation or follow-up requests
- Verify registration was submitted successfully
- Contact NANDA support

### Issue: Endpoint Accessibility Problems

**Possible causes:**
- [ ] Heroku app sleeping (free tier)
- [ ] Environment variables not set
- [ ] Application error

**Solutions:**
```bash
# Wake up Heroku app
curl https://your-app-url.herokuapp.com/health

# Check Heroku logs
heroku logs --tail

# Verify environment variables
heroku config

# Restart Heroku app
heroku restart
```

### Issue: Metadata Incorrect or Outdated

**Solutions:**
- [ ] Update `src/mcp-server/index.js` with new information
- [ ] Update `server.js` `/mcp` endpoint
- [ ] Commit and deploy changes
- [ ] Verify changes at `/mcp` endpoint
- [ ] Update registry listing (if possible)

## Resources

- **NANDA Registry**: https://nanda.media.mit.edu
- **MCP Protocol Documentation**: https://modelcontextprotocol.io/
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **MCP Server Code**: [src/mcp-server/index.js](src/mcp-server/index.js)
- **MCP Quick Start**: [MCP_QUICKSTART.md](MCP_QUICKSTART.md)

## Registration Template

When registering, you can use this template to prepare your information:

```json
{
  "agent_name": "my-first-agent",
  "version": "1.0.0",
  "endpoint_url": "https://your-app-url.herokuapp.com/mcp",
  "protocol": "Model Context Protocol (MCP)",
  "description": "A LangChain-powered AI agent with OpenAI and Google Gemini support",
  "agent_type": "conversational-agent",
  "capabilities": ["chat", "search", "langchain-integration"],
  "providers": ["openai", "google-gemini"],
  "organization": {
    "name": "KeliLabs",
    "contact": "contact@kelilabs.com",
    "github": "https://github.com/KeliLabs",
    "repository": "https://github.com/KeliLabs/my-first-agent"
  },
  "focus_areas": [
    "AI Agent Development",
    "LangChain Integration",
    "Model Context Protocol (MCP) Implementation",
    "Multi-Provider AI Support",
    "Conversational AI",
    "Agent Interoperability"
  ],
  "technology_stack": {
    "frameworks": ["LangChain", "Express.js"],
    "languages": ["JavaScript", "Python"],
    "ai_providers": ["OpenAI", "Google Gemini"]
  }
}
```

## Example: Successful Registration

Once your registration is complete, update this section with your specific details:

```markdown
### Registration Details

- **Registry URL**: https://nanda.media.mit.edu/agents/my-first-agent
- **Registered**: 2024-01-15
- **Status**: ✅ Active
- **Endpoint**: https://your-app-url.herokuapp.com/mcp
- **Last Verified**: 2024-01-15
- **Last Updated**: 2024-01-15

### Verification

```bash
# Registry listing confirmed
curl https://nanda.media.mit.edu/api/agents/my-first-agent

# MCP endpoint accessible
curl https://your-app-url.herokuapp.com/mcp
# Status: 200 OK

# Health check passing
curl https://your-app-url.herokuapp.com/health
# Status: 200 OK
```
```

---

**Note**: This checklist is designed to guide you through the NANDA registration process. The actual registration form and requirements may vary. Refer to the official NANDA documentation for the most current information.
