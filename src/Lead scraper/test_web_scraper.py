#!/usr/bin/env python3
"""
Test script for the web scraper
This will help test if the web interface is working properly
"""

import requests
import time
import json

def test_web_scraper():
    """Test the web scraper with a small sample"""
    
    base_url = "http://localhost:5001"
    
    print("🧪 Testing Web Scraper...")
    print("=" * 50)
    
    # Test 1: Check if server is running
    print("1. Testing server status...")
    try:
        response = requests.get(f"{base_url}/status", timeout=5)
        if response.status_code == 200:
            print("   ✅ Server is running")
            print(f"   📊 Status: {response.json()}")
        else:
            print(f"   ❌ Server returned status code: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Server not responding: {str(e)}")
        print("   💡 Make sure to run: python3 web_scraper.py")
        return
    
    # Test 2: Test a small scraping job (without emails for speed)
    print("\n2. Testing small scraping job...")
    test_data = {
        'location': 'London, UK',
        'search_terms': 'coffee shop',
        'max_results': '5',
        'include_emails': 'off'  # Disable emails for faster testing
    }
    
    try:
        print("   🚀 Starting test scrape...")
        response = requests.post(f"{base_url}/scrape", data=test_data, timeout=10)
        
        if response.status_code == 200:
            print("   ✅ Scrape started successfully")
            result = response.json()
            print(f"   📝 Response: {result}")
            
            # Monitor progress
            print("\n3. Monitoring progress...")
            for i in range(30):  # Monitor for up to 5 minutes
                time.sleep(10)  # Check every 10 seconds
                
                status_response = requests.get(f"{base_url}/status", timeout=5)
                if status_response.status_code == 200:
                    status = status_response.json()
                    print(f"   📊 Progress: {status['progress']}% - {status['message']}")
                    print(f"   🔍 Current: {status['current_query']}")
                    print(f"   📈 Leads found: {status['leads_found']}")
                    print(f"   ⏳ Running: {status['is_running']}")
                    
                    if not status['is_running']:
                        print(f"   ✅ Scraping completed!")
                        print(f"   📊 Final message: {status['message']}")
                        if status['leads_found'] > 0:
                            print(f"   🎉 Success! Found {status['leads_found']} leads")
                        else:
                            print("   ⚠️  No leads found")
                        break
                else:
                    print(f"   ❌ Status check failed: {status_response.status_code}")
                    break
            else:
                print("   ⏰ Test timed out after 5 minutes")
        
        else:
            print(f"   ❌ Scrape failed: {response.status_code}")
            print(f"   📝 Response: {response.text}")
    
    except Exception as e:
        print(f"   ❌ Test failed: {str(e)}")
    
    # Test 4: Check available files
    print("\n4. Checking available files...")
    try:
        response = requests.get(f"{base_url}/files", timeout=5)
        if response.status_code == 200:
            files = response.json()
            print(f"   📁 Found {len(files['files'])} files")
            for file in files['files'][:3]:  # Show first 3 files
                print(f"   📄 {file['name']} ({file['size']} bytes)")
        else:
            print(f"   ❌ Files check failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Files check error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")
    print("💡 If tests passed, your web scraper is working!")
    print("🌐 Open http://localhost:5001 in your browser to use it")

if __name__ == "__main__":
    test_web_scraper()

