#!/usr/bin/env python3
"""
Lead Scraper - Extract business information using Google Places API
"""

import os
import json
import time
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import googlemaps
from typing import List, Dict, Optional

# Load environment variables
load_dotenv()

class LeadScraper:
    def __init__(self, api_key=None):
        """Initialize the lead scraper with Google API key"""
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("Google API key not found in environment variables or provided parameter")
        
        self.gmaps = googlemaps.Client(key=self.api_key)
        self.results = []
        
    def search_places(self, query: str, location: str = None, radius: int = 5000) -> List[Dict]:
        """
        Search for places using Google Places API
        
        Args:
            query: Search term (e.g., "restaurants", "coffee shops")
            location: Location to search around (e.g., "London, UK")
            radius: Search radius in meters (default: 5000m = 5km)
        
        Returns:
            List of place dictionaries
        """
        try:
            print(f"🔍 Searching for: {query}")
            if location:
                print(f"📍 Location: {location}")
                print(f"📏 Radius: {radius}m")
            
            # Perform the search
            places_result = self.gmaps.places(
                query=query,
                location=location,
                radius=radius
            )
            
            places = places_result.get('results', [])
            print(f"✅ Found {len(places)} places")
            
            return places
            
        except Exception as e:
            print(f"❌ Error searching places: {str(e)}")
            return []
    
    def get_place_details(self, place_id: str) -> Optional[Dict]:
        """
        Get detailed information for a specific place
        
        Args:
            place_id: Google Places place_id
        
        Returns:
            Dictionary with detailed place information
        """
        try:
            place_details = self.gmaps.place(
                place_id=place_id,
                fields=['name', 'formatted_address', 'formatted_phone_number', 
                       'website', 'rating', 'user_ratings_total', 'price_level',
                       'opening_hours', 'type', 'business_status']
            )
            
            return place_details.get('result', {})
            
        except Exception as e:
            print(f"❌ Error getting place details for {place_id}: {str(e)}")
            return None
    
    def scrape_leads(self, queries: List[str], location: str = None, max_results: int = 20) -> List[Dict]:
        """
        Scrape leads for multiple search queries
        
        Args:
            queries: List of search terms
            location: Location to search around
            max_results: Maximum number of results per query
        
        Returns:
            List of lead dictionaries
        """
        all_leads = []
        
        for query in queries:
            print(f"\n{'='*50}")
            print(f"Processing query: {query}")
            print(f"{'='*50}")
            
            # Search for places
            places = self.search_places(query, location)
            
            # Limit results
            places = places[:max_results]
            
            for i, place in enumerate(places, 1):
                print(f"\n📋 Processing place {i}/{len(places)}: {place.get('name', 'Unknown')}")
                
                # Get detailed information
                place_id = place.get('place_id')
                if place_id:
                    details = self.get_place_details(place_id)
                    if details:
                        # Combine basic and detailed information
                        lead = {
                            'name': details.get('name', place.get('name', '')),
                            'address': details.get('formatted_address', place.get('formatted_address', '')),
                            'phone': details.get('formatted_phone_number', ''),
                            'website': details.get('website', ''),
                            'rating': details.get('rating', 0),
                            'total_reviews': details.get('user_ratings_total', 0),
                            'price_level': details.get('price_level', ''),
                            'business_status': details.get('business_status', ''),
                            'types': ', '.join(details.get('type', [])),
                            'place_id': place_id,
                            'query_used': query,
                            'scraped_at': datetime.now().isoformat()
                        }
                        
                        all_leads.append(lead)
                        print(f"✅ Added: {lead['name']}")
                
                # Add delay to respect API rate limits
                time.sleep(0.1)
        
        self.results = all_leads
        return all_leads
    
    def save_to_csv(self, filename: str = None, search_terms: list = None) -> str:
        """
        Save results to CSV file
        
        Args:
            filename: Optional custom filename
            search_terms: List of search terms used (for filename generation)
        
        Returns:
            Path to saved file
        """
        if not self.results:
            print("❌ No results to save")
            return None
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if search_terms:
                # Create filename with search terms
                search_terms_clean = '_'.join([term.replace(' ', '_').replace(',', '') for term in search_terms[:3]])
                if len(search_terms) > 3:
                    search_terms_clean += f"_and_{len(search_terms)-3}_more"
                
                # Limit filename length
                if len(search_terms_clean) > 50:
                    search_terms_clean = search_terms_clean[:50]
                
                filename = f"leads_{search_terms_clean}_{timestamp}.csv"
            else:
                filename = f"leads_{timestamp}.csv"
        
        filepath = os.path.join('data', filename)
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Convert to DataFrame and save
        df = pd.DataFrame(self.results)
        df.to_csv(filepath, index=False)
        
        print(f"💾 Saved {len(self.results)} leads to: {filepath}")
        return filepath
    
    def save_to_excel(self, filename: str = None, search_terms: list = None) -> str:
        """
        Save results to Excel file
        
        Args:
            filename: Optional custom filename
            search_terms: List of search terms used (for filename generation)
        
        Returns:
            Path to saved file
        """
        if not self.results:
            print("❌ No results to save")
            return None
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if search_terms:
                # Create filename with search terms
                search_terms_clean = '_'.join([term.replace(' ', '_').replace(',', '') for term in search_terms[:3]])
                if len(search_terms) > 3:
                    search_terms_clean += f"_and_{len(search_terms)-3}_more"
                
                # Limit filename length
                if len(search_terms_clean) > 50:
                    search_terms_clean = search_terms_clean[:50]
                
                filename = f"leads_{search_terms_clean}_{timestamp}.xlsx"
            else:
                filename = f"leads_{timestamp}.xlsx"
        
        filepath = os.path.join('data', filename)
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Convert to DataFrame and save
        df = pd.DataFrame(self.results)
        df.to_excel(filepath, index=False)
        
        print(f"💾 Saved {len(self.results)} leads to: {filepath}")
        return filepath

def main():
    """Main function to run the lead scraper"""
    print("🚀 Lead Scraper Starting...")
    print("=" * 50)
    
    try:
        # Initialize scraper
        scraper = LeadScraper()
        
        # Define search queries (customize these for your needs)
        queries = [
            "restaurants",
            "coffee shops",
            "food delivery",
            "cafes"
        ]
        
        # Define location (customize this)
        location = "London, UK"  # You can change this to your target area
        
        # Scrape leads
        leads = scraper.scrape_leads(
            queries=queries,
            location=location,
            max_results=10  # Limit results per query to avoid API limits
        )
        
        print(f"\n🎉 Scraping completed!")
        print(f"📊 Total leads found: {len(leads)}")
        
        # Save results
        if leads:
            csv_file = scraper.save_to_csv(search_terms=queries)
            excel_file = scraper.save_to_excel(search_terms=queries)
            
            print(f"\n📁 Files saved:")
            print(f"   CSV: {csv_file}")
            print(f"   Excel: {excel_file}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
