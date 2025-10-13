#!/usr/bin/env python3
"""
Quick Lead Scraper - Command line input
Usage: python3 quick_scraper.py "search term" "location" [number_of_results]
"""

import sys
from lead_scraper import LeadScraper

def main():
    """Main function with command line arguments"""
    
    # Check if arguments provided
    if len(sys.argv) < 3:
        print("🚀 Quick Lead Scraper")
        print("=" * 30)
        print("Usage: python3 quick_scraper.py \"search term\" \"location\" [number_of_results]")
        print()
        print("Examples:")
        print("  python3 quick_scraper.py \"pizza\" \"New York, NY\" 10")
        print("  python3 quick_scraper.py \"gyms\" \"London, UK\" 20")
        print("  python3 quick_scraper.py \"coffee shops\" \"Toronto, Canada\"")
        return
    
    # Get arguments
    search_term = sys.argv[1]
    location = sys.argv[2]
    max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    
    print(f"🚀 Quick Lead Scraper")
    print(f"🔍 Searching for: {search_term}")
    print(f"📍 Location: {location}")
    print(f"📊 Max results: {max_results}")
    print("=" * 50)
    
    try:
        # Initialize and run scraper
        scraper = LeadScraper()
        
        leads = scraper.scrape_leads(
            queries=[search_term],
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
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
