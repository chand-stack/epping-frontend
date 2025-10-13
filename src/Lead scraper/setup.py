#!/usr/bin/env python3
"""
Setup script for Lead Scraper
Run this to install dependencies and set up the project
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    print("🔍 Checking environment configuration...")
    
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("📝 Please create a .env file with your Google API key:")
        print("   GOOGLE_API_KEY=your_api_key_here")
        print("   DEBUG=false")
        return False
    
    # Read .env file
    with open('.env', 'r') as f:
        content = f.read()
    
    if 'GOOGLE_API_KEY=' not in content:
        print("❌ GOOGLE_API_KEY not found in .env file!")
        return False
    
    print("✅ Environment configuration looks good!")
    return True

def create_data_directory():
    """Create data directory if it doesn't exist"""
    print("📁 Setting up data directory...")
    os.makedirs('data', exist_ok=True)
    print("✅ Data directory ready!")

def main():
    """Main setup function"""
    print("🚀 Lead Scraper Setup")
    print("=" * 30)
    
    # Check environment
    if not check_env_file():
        return 1
    
    # Install requirements
    if not install_requirements():
        return 1
    
    # Create data directory
    create_data_directory()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Edit config.py to customize your search queries and location")
    print("2. Run: python lead_scraper.py")
    print("3. Check the 'data' folder for your results")
    
    return 0

if __name__ == "__main__":
    exit(main())
