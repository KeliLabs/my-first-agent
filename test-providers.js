const { ChatOpenAI } = require('@langchain/openai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { StringOutputParser } = require('@langchain/core/output_parsers');
require('dotenv').config();

const parser = new StringOutputParser();

async function testProviders() {
    console.log('🧪 Testing AI Providers...\n');
    
    // Test OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        try {
            console.log('Testing OpenAI GPT...');
            const openaiLLM = new ChatOpenAI({
                temperature: 0.7,
                apiKey: process.env.OPENAI_API_KEY,
            });
            
            const messages = [
                new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
                new HumanMessage("Hello, what AI model are you?")
            ];
            
            const response = await openaiLLM.invoke(messages);
            const parsed = await parser.invoke(response);
            console.log('✅ OpenAI Response:', parsed);
        } catch (error) {
            console.log('❌ OpenAI Error:', error.message);
        }
    } else {
        console.log('⚠️  OpenAI API key not configured');
    }
    
    console.log('\n---\n');
    
    // Test Google Gemini
    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_google_api_key_here') {
        try {
            console.log('Testing Google Gemini...');
            const geminiLLM = new ChatGoogleGenerativeAI({
                temperature: 0.7,
                apiKey: process.env.GOOGLE_API_KEY,
                model: "gemini-1.5-flash",
            });
            
            const messages = [
                new SystemMessage("You are a helpful assistant. Keep your responses concise and friendly."),
                new HumanMessage("Hello, what AI model are you?")
            ];
            
            const response = await geminiLLM.invoke(messages);
            const parsed = await parser.invoke(response);
            console.log('✅ Gemini Response:', parsed);
        } catch (error) {
            console.log('❌ Gemini Error:', error.message);
        }
    } else {
        console.log('⚠️  Google API key not configured');
    }
}

testProviders().catch(console.error);
