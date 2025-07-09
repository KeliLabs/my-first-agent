const express = require('express');
const { OpenAI } = require('@langchain/openai');
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { StringOutputParser } = require('@langchain/core/output_parsers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize LangChain model
const llm = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

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
                <textarea id="message" placeholder="Type your message here..."></textarea><br>
                <button type="submit">Send Message</button>
            </form>
            
            <div id="response" class="response" style="display: none;"></div>
        </div>

        <script>
            document.getElementById('chatForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = document.getElementById('message').value;
                const responseDiv = document.getElementById('response');
                
                responseDiv.style.display = 'block';
                responseDiv.innerHTML = 'Thinking...';
                
                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    responseDiv.innerHTML = '<strong>AI:</strong> ' + data.response;
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
    const { message } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' 
      });
    }

    const messages = [
      new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
      new HumanMessage(message)
    ];

    const response = await llm.invoke(messages);
    const parsed = await parser.invoke(response);
    
    res.json({ response: parsed });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 LangChain Hello World app listening at http://localhost:${port}`);
  console.log(`📝 Make sure to set your OPENAI_API_KEY in the .env file`);
});
