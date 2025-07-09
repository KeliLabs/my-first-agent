#!/bin/bash

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Install Python dependencies for LangChain
echo "Installing Python dependencies..."
pip3 install --upgrade pip
pip3 install -r requirements.txt

# Create a sample .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from .env.example"
    echo "⚠️  Please edit .env and add your API keys"
fi

echo "✅ Setup complete!"
echo "📋 Next steps:"
echo "   1. Edit .env and add your OpenAI API key"
echo "   2. Run 'npm start' to start the server"
echo "   3. Open the Jupyter notebook for Python examples"