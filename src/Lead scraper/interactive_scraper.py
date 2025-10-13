#!/usr/bin/env python3
"""
Interactive Lead Scraper - Easy input interface
"""

import os
import sys
from lead_scraper import LeadScraper

def get_user_input():
    """Get input from user interactively"""
    print("🚀 Interactive Lead Scraper")
    print("=" * 40)
    
    # Get location
    print("\n📍 Where do you want to search?")
    print("Examples: 'London, UK', 'New York, NY', 'Toronto, Canada'")
    location = input("Enter location: ").strip()
    
    if not location:
        location = "London, UK"  # Default
        print(f"Using default location: {location}")
    
    # Get search terms
    print("\n🔍 What type of businesses are you looking for?")
    print("Examples: 'restaurants', 'coffee shops', 'pizza', 'gyms', 'salons'")
    print("Enter multiple terms separated by commas:")
    
    search_input = input("Search terms: ").strip()
    
    if not search_input:
        queries = ["restaurants", "coffee shops"]  # Default
        print(f"Using default searches: {queries}")
    else:
        # Split by comma and clean up
        queries = [term.strip() for term in search_input.split(",") if term.strip()]
    
    # Get number of results
    print(f"\n📊 How many results per search term? (1-1000)")
    try:
        max_results = int(input("Number of results: ").strip())
        if max_results < 1 or max_results > 1000:
            max_results = 10
            print(f"Using default: {max_results} results per search")
    except ValueError:
        max_results = 10
        print(f"Using default: {max_results} results per search")
    
    return location, queries, max_results

def main():
    """Main interactive function"""
    try:
        # Get user input
        location, queries, max_results = get_user_input()
        
        # Show summary
        print(f"\n📋 Summary:")
        print(f"   Location: {location}")
        print(f"   Search terms: {', '.join(queries)}")
        print(f"   Results per term: {max_results}")
        print(f"   Total expected results: {len(queries) * max_results}")
        
        # Confirm before starting
        confirm = input(f"\n✅ Start scraping? (y/n): ").strip().lower()
        if confirm not in ['y', 'yes']:
            print("❌ Scraping cancelled.")
            return
        
        # Initialize and run scraper
        print(f"\n🚀 Starting scraper...")
        scraper = LeadScraper()
        
        leads = scraper.scrape_leads(
            queries=queries,
            location=location,
            max_results=max_results
        )
        
        print(f"\n🎉 Scraping completed!")
        print(f"📊 Total leads found: {len(leads)}")
        
        # Save results
        if leads:
            csv_file = scraper.save_to_csv()
            excel_file = scraper.save_to_excel()
            
            print(f"\n📁 Files saved:")
            print(f"   CSV: {csv_file}")
            print(f"   Excel: {excel_file}")
            
            # Show sample results
            print(f"\n📋 Sample results:")
            for i, lead in enumerate(leads[:3], 1):
                print(f"   {i}. {lead['name']} - {lead['address']}")
                if lead['phone']:
                    print(f"      Phone: {lead['phone']}")
                if lead['website']:
                    print(f"      Website: {lead['website']}")
                print()
        
    except KeyboardInterrupt:
        print(f"\n❌ Scraping interrupted by user.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
