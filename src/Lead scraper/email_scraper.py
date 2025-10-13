#!/usr/bin/env python3
"""
Enhanced Lead Scraper with Email Extraction
This version tries to find emails from websites and other sources
"""

import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from lead_scraper import LeadScraper
import pandas as pd
from datetime import datetime

class EmailLeadScraper(LeadScraper):
    def __init__(self, api_key=None):
        super().__init__(api_key)
        self.email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b'
        ]
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def extract_emails_from_text(self, text):
        """Extract email addresses from text"""
        emails = set()
        for pattern in self.email_patterns:
            found_emails = re.findall(pattern, text, re.IGNORECASE)
            for email in found_emails:
                # Clean up the email
                email = email.strip().replace(' ', '')
                if self.is_valid_email(email):
                    emails.add(email.lower())
        return list(emails)
    
    def is_valid_email(self, email):
        """Basic email validation"""
        if not email or len(email) < 5:
            return False
        if email.count('@') != 1:
            return False
        if email.startswith('.') or email.endswith('.'):
            return False
        if '..' in email:
            return False
        return True
    
    def scrape_website_for_emails(self, url, max_pages=3):
        """Scrape a website for email addresses"""
        emails = set()
        
        try:
            # Clean and validate URL
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            # Get main page
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract emails from main page
                page_text = soup.get_text()
                page_emails = self.extract_emails_from_text(page_text)
                emails.update(page_emails)
                
                # Look for contact/about pages
                contact_links = []
                for link in soup.find_all('a', href=True):
                    href = link.get('href', '').lower()
                    text = link.get_text().lower()
                    if any(word in href or word in text for word in ['contact', 'about', 'info']):
                        full_url = urljoin(url, link['href'])
                        contact_links.append(full_url)
                
                # Check contact pages (limit to avoid too many requests)
                for contact_url in contact_links[:max_pages-1]:
                    try:
                        time.sleep(1)  # Be respectful
                        contact_response = self.session.get(contact_url, timeout=10)
                        if contact_response.status_code == 200:
                            contact_soup = BeautifulSoup(contact_response.content, 'html.parser')
                            contact_text = contact_soup.get_text()
                            contact_emails = self.extract_emails_from_text(contact_text)
                            emails.update(contact_emails)
                    except:
                        continue
                        
        except Exception as e:
            print(f"   ⚠️  Could not scrape website {url}: {str(e)}")
        
        return list(emails)
    
    def find_emails_from_google(self, business_name, location):
        """Try to find emails using Google search"""
        emails = set()
        
        try:
            # Search for business contact info
            search_queries = [
                f'"{business_name}" contact email {location}',
                f'"{business_name}" {location} email',
                f'"{business_name}" contact information'
            ]
            
            for query in search_queries:
                try:
                    time.sleep(2)  # Be respectful to Google
                    # Note: This is a simplified approach. For production, consider using Google Custom Search API
                    print(f"   🔍 Searching Google for: {query}")
                    # In a real implementation, you'd use Google Custom Search API here
                    # For now, we'll skip this to avoid rate limiting
                except:
                    continue
                    
        except Exception as e:
            print(f"   ⚠️  Google search failed: {str(e)}")
        
        return list(emails)
    
    def enhance_lead_with_email(self, lead):
        """Enhance a lead with email information"""
        print(f"   📧 Looking for email for: {lead['name']}")
        
        emails = []
        
        # Try to get email from website
        if lead.get('website'):
            print(f"   🌐 Checking website: {lead['website']}")
            website_emails = self.scrape_website_for_emails(lead['website'])
            emails.extend(website_emails)
        
        # Try Google search if no website or no emails found
        if not emails and lead.get('name'):
            print(f"   🔍 Searching Google for contact info...")
            google_emails = self.find_emails_from_google(lead['name'], lead.get('address', ''))
            emails.extend(google_emails)
        
        # Add emails to lead
        if emails:
            lead['emails'] = ', '.join(emails)
            print(f"   ✅ Found emails: {', '.join(emails)}")
        else:
            lead['emails'] = ''
            print(f"   ❌ No emails found")
        
        return lead
    
    def scrape_leads_with_emails(self, queries, location=None, max_results=20, enhance_with_emails=True):
        """Scrape leads and optionally enhance with email addresses"""
        print("🚀 Starting enhanced lead scraping with email extraction...")
        
        # First, get the basic leads
        leads = self.scrape_leads(queries, location, max_results)
        
        if enhance_with_emails and leads:
            print(f"\n📧 Enhancing {len(leads)} leads with email addresses...")
            print("⚠️  This may take a while as we check websites...")
            
            enhanced_leads = []
            for i, lead in enumerate(leads, 1):
                print(f"\n📋 Processing lead {i}/{len(leads)}")
                enhanced_lead = self.enhance_lead_with_email(lead)
                enhanced_leads.append(enhanced_lead)
                
                # Add delay to be respectful
                time.sleep(1)
            
            self.results = enhanced_leads
            return enhanced_leads
        
        return leads

def main():
    """Main function for email-enhanced scraping"""
    print("🚀 Email-Enhanced Lead Scraper")
    print("=" * 50)
    
    try:
        # Initialize enhanced scraper
        scraper = EmailLeadScraper()
        
        # Get user input
        print("\n📍 Where do you want to search?")
        location = input("Enter location (e.g., 'London, UK'): ").strip() or "London, UK"
        
        print("\n🔍 What type of businesses?")
        search_input = input("Search terms (comma-separated): ").strip()
        queries = [term.strip() for term in search_input.split(",") if term.strip()] if search_input else ["restaurants"]
        
        print(f"\n📊 How many results per search? (1-1000)")
        try:
            max_results = int(input("Number of results: ").strip()) or 10
            if max_results > 1000:
                max_results = 1000
                print(f"Limited to 1000 results per search")
        except:
            max_results = 10
        
        print(f"\n📧 Include email extraction? (This will take longer)")
        include_emails = input("Extract emails? (y/n): ").strip().lower() in ['y', 'yes']
        
        # Show summary
        print(f"\n📋 Summary:")
        print(f"   Location: {location}")
        print(f"   Search terms: {', '.join(queries)}")
        print(f"   Results per term: {max_results}")
        print(f"   Email extraction: {'Yes' if include_emails else 'No'}")
        
        confirm = input(f"\n✅ Start scraping? (y/n): ").strip().lower()
        if confirm not in ['y', 'yes']:
            print("❌ Scraping cancelled.")
            return
        
        # Run enhanced scraping
        leads = scraper.scrape_leads_with_emails(
            queries=queries,
            location=location,
            max_results=max_results,
            enhance_with_emails=include_emails
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
            
            # Show email statistics
            if include_emails:
                leads_with_emails = [lead for lead in leads if lead.get('emails')]
                print(f"\n📧 Email Statistics:")
                print(f"   Leads with emails: {len(leads_with_emails)}/{len(leads)}")
                print(f"   Success rate: {len(leads_with_emails)/len(leads)*100:.1f}%")
                
                if leads_with_emails:
                    print(f"\n📋 Sample leads with emails:")
                    for lead in leads_with_emails[:3]:
                        print(f"   • {lead['name']}: {lead['emails']}")
        
    except KeyboardInterrupt:
        print(f"\n❌ Scraping interrupted by user.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
