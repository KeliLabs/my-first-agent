#!/usr/bin/env python3
"""
LangChain Hello World - Python CLI
A simple command-line interface for LangChain with OpenAI and Google Gemini support
"""

import os
import sys
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage

def get_llm(provider="openai"):
    """Initialize and return the LLM based on provider"""
    if provider == "openai":
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        return ChatOpenAI(
            temperature=0.7,
            model_name="gpt-3.5-turbo",
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
    elif provider == "gemini":
        if not os.getenv("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        return ChatGoogleGenerativeAI(
            temperature=0.7,
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
    else:
        raise ValueError(f"Unsupported provider: {provider}")

def main():
    # Load environment variables
    load_dotenv()
    
    # Check available providers
    openai_available = bool(os.getenv("OPENAI_API_KEY"))
    gemini_available = bool(os.getenv("GOOGLE_API_KEY"))
    
    if not openai_available and not gemini_available:
        print("❌ Error: No API keys found.")
        print("Please set OPENAI_API_KEY or GOOGLE_API_KEY in the .env file.")
        sys.exit(1)
    
    # Default to available provider
    current_provider = "openai" if openai_available else "gemini"
    
    print("🦜 LangChain Hello World - Python CLI")
    print("=" * 50)
    print("Available providers:")
    if openai_available:
        print("  ✅ OpenAI GPT")
    if gemini_available:
        print("  ✅ Google Gemini")
    print()
    print("Type 'exit' to quit, 'help' for commands")
    print(f"Current provider: {current_provider.upper()}")
    print()
    
    # Initialize the LLM
    try:
        llm = get_llm(current_provider)
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    
    # System message
    system_message = SystemMessage(content="You are a helpful assistant. Keep your responses concise and friendly.")
    
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            # Handle special commands
            if user_input.lower() == 'exit':
                print("👋 Goodbye!")
                break
            elif user_input.lower() == 'help':
                print("\nAvailable commands:")
                print("- exit: Quit the program")
                print("- help: Show this help message")
                print("- clear: Clear the screen")
                print("- provider openai: Switch to OpenAI GPT")
                print("- provider gemini: Switch to Google Gemini")
                print("- status: Show current provider and available options")
                print("- Just type your message to chat with AI")
                print()
                continue
            elif user_input.lower() == 'clear':
                os.system('clear' if os.name == 'posix' else 'cls')
                continue
            elif user_input.lower() == 'status':
                print(f"\nCurrent provider: {current_provider.upper()}")
                print("Available providers:")
                if openai_available:
                    print("  ✅ OpenAI GPT")
                if gemini_available:
                    print("  ✅ Google Gemini")
                print()
                continue
            elif user_input.lower().startswith('provider '):
                new_provider = user_input.lower().split(' ', 1)[1]
                if new_provider == 'openai' and openai_available:
                    current_provider = 'openai'
                    llm = get_llm(current_provider)
                    print(f"✅ Switched to OpenAI GPT\n")
                elif new_provider == 'gemini' and gemini_available:
                    current_provider = 'gemini'
                    llm = get_llm(current_provider)
                    print(f"✅ Switched to Google Gemini\n")
                else:
                    print(f"❌ Provider '{new_provider}' not available or not supported\n")
                continue
            elif not user_input:
                continue
            
            # Create messages
            messages = [
                system_message,
                HumanMessage(content=user_input)
            ]
            
            # Get AI response
            provider_name = "OpenAI GPT" if current_provider == "openai" else "Google Gemini"
            print(f"🤖 {provider_name}: ", end="", flush=True)
            response = llm.invoke(messages)
            print(response.content)
            print()
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            print()

if __name__ == "__main__":
    main()
