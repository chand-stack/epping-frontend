#!/usr/bin/env python3
"""
Web-based Lead Scraper
A Flask web application for lead generation
"""

from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for
import os
import json
import pandas as pd
from datetime import datetime
from lead_scraper import LeadScraper
from email_scraper import EmailLeadScraper
import threading
import time
import signal

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Load API keys configuration
def load_api_keys():
    """Load API keys from configuration file"""
    try:
        with open('api_keys.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "api_keys": {
                "Account 1": "AIzaSyCG-v8J1nAPOB0ZRQFNSt-rHEHBTqXTzdw"
            },
            "current_key": "Account 1",
            "key_usage": {
                "Account 1": 0
            }
        }

def save_api_keys(config):
    """Save API keys configuration"""
    with open('api_keys.json', 'w') as f:
        json.dump(config, f, indent=2)

def get_current_api_key():
    """Get the currently selected API key"""
    config = load_api_keys()
    return config['api_keys'][config['current_key']]

def switch_api_key(account_name):
    """Switch to a different API key"""
    config = load_api_keys()
    if account_name in config['api_keys']:
        config['current_key'] = account_name
        save_api_keys(config)
        return True
    return False

# Global variables to store scraping status
scraping_status = {
    'is_running': False,
    'progress': 0,
    'current_query': '',
    'total_queries': 0,
    'leads_found': 0,
    'message': '',
    'results': []
}

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape_leads():
    """Start scraping leads"""
    global scraping_status
    
    if scraping_status['is_running']:
        return jsonify({'error': 'Scraping is already in progress'})
    
    # Get form data
    api_account = request.form.get('apiKey', 'Account 1')
    location = request.form.get('location', 'London, UK')
    search_terms = request.form.get('search_terms', '')
    max_results = int(request.form.get('max_results', 10))
    include_emails = request.form.get('include_emails') == 'on'
    
    # Switch to selected API key
    if not switch_api_key(api_account):
        return jsonify({'error': f'Invalid API account: {api_account}'})
    
    # Parse search terms
    queries = [term.strip() for term in search_terms.split(',') if term.strip()]
    
    if not queries:
        return jsonify({'error': 'Please enter at least one search term'})
    
    # Reset status
    scraping_status.update({
        'is_running': True,
        'progress': 0,
        'current_query': '',
        'total_queries': len(queries),
        'leads_found': 0,
        'message': 'Starting scraper...',
        'results': []
    })
    
    # Start scraping in background thread
    thread = threading.Thread(
        target=run_scraper,
        args=(queries, location, max_results, include_emails)
    )
    thread.daemon = True
    thread.start()
    
    # Set a timeout to prevent hanging (30 minutes max)
    def timeout_handler():
        time.sleep(1800)  # 30 minutes
        if scraping_status['is_running']:
            scraping_status['is_running'] = False
            scraping_status['message'] = 'Scraping timed out after 30 minutes'
    
    timeout_thread = threading.Thread(target=timeout_handler)
    timeout_thread.daemon = True
    timeout_thread.start()
    
    return jsonify({'success': True, 'message': 'Scraping started'})

def run_scraper(queries, location, max_results, include_emails):
    """Run the scraper in background"""
    global scraping_status
    
    try:
        # Get current API key
        current_api_key = get_current_api_key()
        
        # Initialize scraper with current API key
        if include_emails:
            scraper = EmailLeadScraper(api_key=current_api_key)
        else:
            scraper = LeadScraper(api_key=current_api_key)
        
        all_leads = []
        total_places = 0
        
        for i, query in enumerate(queries):
            scraping_status['current_query'] = query
            scraping_status['progress'] = int((i / len(queries)) * 100)
            scraping_status['message'] = f'Processing: {query}'
            
            # Search for places
            places = scraper.search_places(query, location, radius=5000)
            places = places[:max_results]
            total_places += len(places)
            
            scraping_status['message'] = f'Found {len(places)} places for "{query}". Processing details...'
            
            for j, place in enumerate(places):
                place_id = place.get('place_id')
                if place_id:
                    try:
                        details = scraper.get_place_details(place_id)
                        if details:
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
                            
                            # Add email if requested (with timeout protection)
                            if include_emails and lead.get('website'):
                                try:
                                    scraping_status['message'] = f'Getting email for: {lead["name"]}'
                                    emails = scraper.scrape_website_for_emails(lead['website'])
                                    lead['emails'] = ', '.join(emails) if emails else ''
                                except Exception as e:
                                    print(f"Email scraping failed for {lead['name']}: {str(e)}")
                                    lead['emails'] = ''
                            
                            all_leads.append(lead)
                            scraping_status['leads_found'] = len(all_leads)
                            
                            # Update progress more frequently
                            current_progress = int(((i * max_results + j + 1) / (len(queries) * max_results)) * 100)
                            scraping_status['progress'] = min(current_progress, 95)
                            scraping_status['message'] = f'Processed {j+1}/{len(places)} places for "{query}". Found {len(all_leads)} total leads.'
                    
                    except Exception as e:
                        print(f"Error processing place {place_id}: {str(e)}")
                        continue
                
                time.sleep(0.1)  # Rate limiting
        
        # Save results
        if all_leads:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Create filename with search terms
            search_terms_clean = '_'.join([term.replace(' ', '_').replace(',', '') for term in queries[:3]])
            if len(queries) > 3:
                search_terms_clean += f"_and_{len(queries)-3}_more"
            
            # Limit filename length
            if len(search_terms_clean) > 50:
                search_terms_clean = search_terms_clean[:50]
            
            filename = f"leads_{search_terms_clean}_{timestamp}.csv"
            filepath = os.path.join('data', filename)
            
            # Create data directory if it doesn't exist
            os.makedirs('data', exist_ok=True)
            
            # Save to CSV
            df = pd.DataFrame(all_leads)
            df.to_csv(filepath, index=False)
            
            scraping_status['results'] = all_leads
            scraping_status['message'] = f'Completed! Found {len(all_leads)} leads. Saved to {filename}'
        else:
            scraping_status['message'] = 'No leads found'
        
        scraping_status['progress'] = 100
        
    except Exception as e:
        scraping_status['message'] = f'Error: {str(e)}'
    
    finally:
        scraping_status['is_running'] = False

@app.route('/status')
def get_status():
    """Get scraping status"""
    return jsonify(scraping_status)

@app.route('/api-status')
def get_api_status():
    """Get current API key status"""
    config = load_api_keys()
    return jsonify({
        'current_key': config['current_key'],
        'available_keys': list(config['api_keys'].keys()),
        'key_usage': config['key_usage']
    })

@app.route('/download/<filename>')
def download_file(filename):
    """Download generated file"""
    filepath = os.path.join('data', filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'})

@app.route('/files')
def list_files():
    """List available files"""
    data_dir = 'data'
    if not os.path.exists(data_dir):
        return jsonify({'files': []})
    
    files = []
    for filename in os.listdir(data_dir):
        if filename.endswith('.csv'):
            filepath = os.path.join(data_dir, filename)
            stat = os.stat(filepath)
            files.append({
                'name': filename,
                'size': stat.st_size,
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat()
            })
    
    # Sort by creation time (newest first)
    files.sort(key=lambda x: x['created'], reverse=True)
    return jsonify({'files': files})

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    print("🚀 Starting LeadScraper Pro...")
    print("📱 Open your browser and go to: http://localhost:5001")
    print("🛑 Press Ctrl+C to stop the server")
    print("🔒 Port 5001 is reserved exclusively for LeadScraper Pro")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
