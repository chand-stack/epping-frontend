from flask import Flask, request, jsonify
import os
import json
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re
import time
import threading
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Global variables for status tracking
scraping_status = {
    'is_running': False,
    'current_query': '',
    'leads_found': 0,
    'total_queries': 0,
    'completed_queries': 0,
    'error': None
}

def get_place_details(place_id, api_key):
    """Get detailed information about a place"""
    try:
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            'place_id': place_id,
            'fields': 'name,formatted_address,formatted_phone_number,website,type,rating,user_ratings_total',
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            result = data['result']
            return {
                'name': result.get('name', ''),
                'address': result.get('formatted_address', ''),
                'phone': result.get('formatted_phone_number', ''),
                'website': result.get('website', ''),
                'type': ', '.join(result.get('type', [])),
                'rating': result.get('rating', ''),
                'reviews': result.get('user_ratings_total', '')
            }
    except Exception as e:
        print(f"Error getting place details: {e}")
    
    return None

def extract_email_from_website(url):
    """Extract email from a website"""
    try:
        if not url or not url.startswith(('http://', 'https://')):
            return 'No email found'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for email patterns
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        text = soup.get_text()
        emails = re.findall(email_pattern, text)
        
        if emails:
            # Return the first valid email
            return emails[0]
        
        # Also check href attributes for mailto links
        mailto_links = soup.find_all('a', href=re.compile(r'^mailto:'))
        if mailto_links:
            email = mailto_links[0]['href'].replace('mailto:', '')
            return email
            
    except Exception as e:
        print(f"Error extracting email from {url}: {e}")
    
    return 'No email found'

def search_places(query, location, api_key, max_results=20):
    """Search for places using Google Places API"""
    places = []
    
    try:
        url = "https://maps.googleapis.com/maps/api/place/text/search/json"
        params = {
            'query': f"{query} in {location}",
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            for place in data['results'][:max_results]:
                place_id = place['place_id']
                details = get_place_details(place_id, api_key)
                
                if details:
                    places.append(details)
                
                # Rate limiting
                time.sleep(0.1)
        
        # Handle pagination if needed
        if 'next_page_token' in data and len(places) < max_results:
            time.sleep(2)  # Required delay for next_page_token
            params['pagetoken'] = data['next_page_token']
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if data['status'] == 'OK':
                for place in data['results'][:max_results - len(places)]:
                    place_id = place['place_id']
                    details = get_place_details(place_id, api_key)
                    
                    if details:
                        places.append(details)
                    
                    time.sleep(0.1)
    
    except Exception as e:
        print(f"Error searching places: {e}")
    
    return places

def scrape_leads_async(location, queries, max_results, include_emails):
    """Async function to scrape leads"""
    global scraping_status
    
    try:
        scraping_status['is_running'] = True
        scraping_status['total_queries'] = len(queries)
        scraping_status['completed_queries'] = 0
        scraping_status['leads_found'] = 0
        scraping_status['error'] = None
        
        api_key = os.getenv('GOOGLE_API_KEY')
        all_leads = []
        
        for i, query in enumerate(queries):
            scraping_status['current_query'] = query
            scraping_status['completed_queries'] = i
            
            print(f"Searching for: {query}")
            places = search_places(query, location, api_key, max_results)
            
            if include_emails:
                for place in places:
                    if place['website']:
                        place['email'] = extract_email_from_website(place['website'])
                    else:
                        place['email'] = 'No email found'
            else:
                for place in places:
                    place['email'] = 'Email extraction disabled'
            
            all_leads.extend(places)
            scraping_status['leads_found'] = len(all_leads)
            
            # Rate limiting between queries
            time.sleep(1)
        
        scraping_status['completed_queries'] = len(queries)
        
        # Save results to a temporary location (Vercel doesn't have persistent file system)
        # In a real deployment, you'd save to a database or cloud storage
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        search_terms_clean = '_'.join([term.replace(' ', '_').replace(',', '') for term in queries[:3]])
        if len(queries) > 3:
            search_terms_clean += f"_and_{len(queries)-3}_more"
        
        if len(search_terms_clean) > 50:
            search_terms_clean = search_terms_clean[:50]
        
        filename = f"leads_{search_terms_clean}_{timestamp}.json"
        
        # Store results in memory (in production, use a database)
        scraping_status['results'] = {
            'filename': filename,
            'leads': all_leads,
            'total_leads': len(all_leads),
            'timestamp': timestamp
        }
        
    except Exception as e:
        scraping_status['error'] = str(e)
        print(f"Error in scraping: {e}")
    finally:
        scraping_status['is_running'] = False

@app.route('/api/scrape', methods=['POST'])
def scrape():
    """Start scraping leads"""
    global scraping_status
    
    if scraping_status['is_running']:
        return jsonify({'error': 'Scraping is already in progress'}), 400
    
    data = request.form
    location = data.get('location', '')
    search_terms = data.get('search_terms', '')
    max_results = int(data.get('max_results', 20))
    include_emails = data.get('include_emails') == 'on'
    
    if not location or not search_terms:
        return jsonify({'error': 'Location and search terms are required'}), 400
    
    queries = [term.strip() for term in search_terms.split(',') if term.strip()]
    
    # Start scraping in a separate thread
    thread = threading.Thread(target=scrape_leads_async, args=(location, queries, max_results, include_emails))
    thread.start()
    
    return jsonify({'message': 'Scraping started'})

@app.route('/api/status')
def status():
    """Get scraping status"""
    return jsonify(scraping_status)

@app.route('/api/download/<filename>')
def download(filename):
    """Download results"""
    if 'results' in scraping_status and scraping_status['results']['filename'] == filename:
        leads = scraping_status['results']['leads']
        
        # Convert to CSV format
        csv_content = "Name,Address,Phone,Website,Type,Rating,Reviews,Email\n"
        for lead in leads:
            csv_content += f'"{lead.get("name", "")}","{lead.get("address", "")}","{lead.get("phone", "")}","{lead.get("website", "")}","{lead.get("type", "")}","{lead.get("rating", "")}","{lead.get("reviews", "")}","{lead.get("email", "")}"\n'
        
        return csv_content, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename={filename.replace(".json", ".csv")}'
        }
    
    return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
