#!/usr/bin/env python3
"""
LangChain Hello World - Python CLI
A simple command-line interface for LangChain
"""

import os
import sys
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

def main():
    # Load environment variables
    load_dotenv()
    
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        print("Please set your OpenAI API key in the .env file.")
        sys.exit(1)
    
    # Initialize the LLM
    llm = ChatOpenAI(
        temperature=0.7,
        model_name="gpt-3.5-turbo",
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
    
    print("🦜 LangChain Hello World - Python CLI")
    print("=" * 50)
    print("Type 'exit' to quit, 'help' for commands")
    print()
    
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
                print("- Just type your message to chat with AI")
                print()
                continue
            elif user_input.lower() == 'clear':
                os.system('clear' if os.name == 'posix' else 'cls')
                continue
            elif not user_input:
                continue
            
            # Create messages
            messages = [
                system_message,
                HumanMessage(content=user_input)
            ]
            
            # Get AI response
            print("🤖 AI: ", end="", flush=True)
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
