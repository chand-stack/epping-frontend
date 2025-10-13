#!/usr/bin/env python3
"""
Get 500 Estate Agent and Property Management Leads
Custom script to get a large number of leads
"""

from lead_scraper import LeadScraper
import time

def get_500_property_leads():
    """Get 500 property-related leads"""
    
    print("🚀 Getting 500 Property Leads")
    print("=" * 50)
    
    # Initialize scraper
    scraper = LeadScraper()
    
    # Define comprehensive search terms for property industry
    search_terms = [
        "estate agents",
        "property management", 
        "letting agents",
        "property consultants",
        "real estate agents",
        "property sales",
        "property lettings",
        "residential property",
        "commercial property",
        "property investment",
        "property development",
        "property services",
        "property advisors",
        "property specialists",
        "property experts",
        "property brokers",
        "property agents",
        "property companies",
        "property firms",
        "property professionals"
    ]
    
    # Location
    location = "East London, UK"
    
    # Calculate results per term to get close to target
    target_leads = 1000  # Increased target
    results_per_term = min(target_leads // len(search_terms), 1000)  # Cap at 1000 per term
    
    print(f"📍 Location: {location}")
    print(f"🔍 Search terms: {len(search_terms)} different property-related searches")
    print(f"📊 Results per term: {results_per_term}")
    print(f"🎯 Target total: ~{len(search_terms) * results_per_term} leads")
    print("=" * 50)
    
    # Confirm before starting
    confirm = input("✅ Start scraping 500 leads? (y/n): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("❌ Scraping cancelled.")
        return
    
    try:
        # Scrape leads
        leads = scraper.scrape_leads(
            queries=search_terms,
            location=location,
            max_results=results_per_term
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
            for i, lead in enumerate(leads[:10], 1):
                print(f"   {i}. {lead['name']} - {lead['address']}")
                if lead['phone']:
                    print(f"      Phone: {lead['phone']}")
                if lead['website']:
                    print(f"      Website: {lead['website']}")
                print()
            
            # Show breakdown by search term
            print(f"\n📊 Breakdown by search term:")
            for query in search_terms:
                query_leads = [lead for lead in leads if lead['query_used'] == query]
                if query_leads:
                    print(f"   {query}: {len(query_leads)} leads")
        
        return leads
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

if __name__ == "__main__":
    get_500_property_leads()
