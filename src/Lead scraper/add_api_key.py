#!/usr/bin/env python3
"""
Add API Key Script
Helps you add additional Google API keys to use different accounts
"""

import json
import os

def add_api_key():
    """Interactive script to add API keys"""
    print("🔑 Add Google API Key")
    print("=" * 40)
    
    # Load existing config
    try:
        with open('api_keys.json', 'r') as f:
            config = json.load(f)
    except FileNotFoundError:
        config = {
            "api_keys": {},
            "current_key": "",
            "key_usage": {}
        }
    
    print(f"\nCurrent accounts: {list(config['api_keys'].keys())}")
    
    # Get account name
    account_name = input("\nEnter account name (e.g., 'Account 2', 'My Business Account'): ").strip()
    if not account_name:
        print("❌ Account name cannot be empty")
        return
    
    # Get API key
    api_key = input("Enter your Google API key: ").strip()
    if not api_key:
        print("❌ API key cannot be empty")
        return
    
    # Add to config
    config['api_keys'][account_name] = api_key
    config['key_usage'][account_name] = 0
    
    # Set as current if it's the first one
    if not config['current_key']:
        config['current_key'] = account_name
        print(f"✅ Set {account_name} as current account")
    
    # Save config
    with open('api_keys.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Added {account_name} successfully!")
    print(f"📊 Total accounts: {len(config['api_keys'])}")
    print(f"🎯 Current account: {config['current_key']}")
    
    # Show usage instructions
    print("\n" + "=" * 40)
    print("📖 How to use:")
    print("1. Start the web scraper: python3 web_scraper.py")
    print("2. Open http://localhost:5001 in your browser")
    print("3. Select your API account from the dropdown")
    print("4. Start scraping with that account's credits!")

if __name__ == "__main__":
    add_api_key()
