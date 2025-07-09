#!/usr/bin/env python3
"""
Test script for both OpenAI and Google Gemini providers
"""

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage

# Load environment variables
load_dotenv()

def test_providers():
    print("🧪 Testing Python LangChain Providers...")
    print("=" * 50)
    
    # Test OpenAI
    if os.getenv("OPENAI_API_KEY"):
        try:
            print("\n🔵 Testing OpenAI GPT...")
            openai_llm = ChatOpenAI(
                temperature=0.7,
                model_name="gpt-3.5-turbo",
                openai_api_key=os.getenv("OPENAI_API_KEY")
            )
            
            messages = [
                SystemMessage(content="You are a helpful assistant."),
                HumanMessage(content="Hello, what AI model are you?")
            ]
            
            response = openai_llm.invoke(messages)
            print(f"✅ OpenAI Response: {response.content}")
        except Exception as e:
            print(f"❌ OpenAI Error: {e}")
    else:
        print("\n⚠️  OpenAI API key not configured")
    
    # Test Google Gemini
    if os.getenv("GOOGLE_API_KEY"):
        try:
            print("\n🔴 Testing Google Gemini...")
            gemini_llm = ChatGoogleGenerativeAI(
                temperature=0.7,
                model="gemini-1.5-flash",
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
            
            messages = [
                SystemMessage(content="You are a helpful assistant."),
                HumanMessage(content="Hello, what AI model are you?")
            ]
            
            response = gemini_llm.invoke(messages)
            print(f"✅ Gemini Response: {response.content}")
        except Exception as e:
            print(f"❌ Gemini Error: {e}")
    else:
        print("\n⚠️  Google API key not configured")
    
    print("\n🎉 Python provider testing complete!")

if __name__ == "__main__":
    test_providers()
