const express = require('express');
const { ChatOpenAI } = require('@langchain/openai');
// const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { StringOutputParser } = require('@langchain/core/output_parsers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize LangChain models
const openaiLLM = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

// Initialize Gemini using dedicated ChatGoogleGenerativeAI
let geminiLLM;
if (process.env.GOOGLE_API_KEY) {
  // geminiLLM = new ChatGoogleGenerativeAI({
  //   temperature: 0.7,
  //   apiKey: process.env.GOOGLE_API_KEY,
  //   model: "gemini-1.5-flash",
  // });
  geminiLLM = new ChatOpenAI({
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  });
}

// Default to OpenAI, but allow switching
const getLLM = (provider = 'openai') => {
  switch (provider) {
    case 'gemini':
      if (!geminiLLM) {
        throw new Error('Google API key not configured. Please set GOOGLE_API_KEY in your .env file.');
      }
      return geminiLLM;
    case 'openai':
    default:
      return openaiLLM;
  }
};

const parser = new StringOutputParser();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>LangChain Hello World</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            textarea { width: 100%; height: 100px; margin: 10px 0; }
            button { padding: 10px 20px; background: #007cba; color: white; border: none; cursor: pointer; }
            button:hover { background: #005a8b; }
            .response { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🦜 LangChain Hello World</h1>
            <p>This is a simple LangChain application running in a GitHub Codespace!</p>
            
            <h2>Chat with AI</h2>
            <form id="chatForm">
                <label for="provider">Choose AI Provider:</label>
                <select id="provider" style="margin: 10px 0; padding: 5px;">
                    <option value="openai">OpenAI GPT</option>
                    <option value="gemini">Google Gemini</option>
                </select><br>
                <textarea id="message" placeholder="Type your message here..."></textarea><br>
                <button type="submit">Send Message</button>
            </form>
            
            <div id="response" class="response" style="display: none;"></div>
        </div>

        <script>
            document.getElementById('chatForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = document.getElementById('message').value;
                const provider = document.getElementById('provider').value;
                const responseDiv = document.getElementById('response');
                
                responseDiv.style.display = 'block';
                responseDiv.innerHTML = 'Thinking... (using ' + (provider === 'openai' ? 'OpenAI GPT' : 'Google Gemini') + ')';
                
                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ message, provider })
                    });
                    
                    const data = await response.json();
                    const providerName = provider === 'openai' ? 'OpenAI GPT' : 'Google Gemini';
                    responseDiv.innerHTML = '<strong>' + providerName + ':</strong> ' + data.response;
                } catch (error) {
                    responseDiv.innerHTML = 'Error: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
  `);
});

app.post('/chat', async (req, res) => {
  try {
    const { message, provider = 'openai' } = req.body;
    
    // Check API keys based on provider
    if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' 
      });
    }
    
    if (provider === 'gemini' && !process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ 
        error: 'Google API key not configured. Please set GOOGLE_API_KEY in your .env file.' 
      });
    }

    const llm = getLLM(provider);
    const messages = [
      new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
      new HumanMessage(message)
    ];

    const response = await llm.invoke(messages);
    const parsed = await parser.invoke(response);
    
    res.json({ response: parsed });
  } catch (error) {
    console.error('Error:', error);
    if (error.message.includes('Google API key not configured')) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 LangChain Hello World app listening at http://localhost:${port}`);
  console.log(`📝 Make sure to set your API keys in the .env file:`);
  console.log(`   - OPENAI_API_KEY for OpenAI GPT`);
  console.log(`   - GOOGLE_API_KEY for Google Gemini`);
});
