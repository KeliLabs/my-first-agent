# LangChain Hello World

A simple LangChain application running in a GitHub Codespace, demonstrating basic AI chat functionality.

## Features

- 🦜 LangChain integration with OpenAI
- 🌐 Express.js web server
- 💬 Interactive chat interface
- 🐍 Python support for advanced LangChain features
- 📊 Jupyter notebook support
- 🔧 Pre-configured dev container

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

## Development

### Node.js Development

- `npm run dev` - Start with nodemon for auto-reload
- `npm start` - Start the production server

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
