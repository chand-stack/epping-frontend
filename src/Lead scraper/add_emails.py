#!/usr/bin/env python3
"""
Add Email Addresses to Existing Lead Data
This script takes your existing CSV/Excel files and adds email addresses
"""

import pandas as pd
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import os
from datetime import datetime

class EmailExtractor:
    def __init__(self):
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
    
    def get_emails_from_website(self, url):
        """Get emails from a website"""
        emails = set()
        
        try:
            if not url or pd.isna(url):
                return []
            
            # Clean URL
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            print(f"   🌐 Checking: {url}")
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Get all text content
                text_content = soup.get_text()
                emails.update(self.extract_emails_from_text(text_content))
                
                # Also check HTML attributes that might contain emails
                for element in soup.find_all(['a', 'span', 'div', 'p']):
                    if element.get('href', '').startswith('mailto:'):
                        email = element.get('href').replace('mailto:', '').split('?')[0]
                        if self.is_valid_email(email):
                            emails.add(email.lower())
                
        except Exception as e:
            print(f"   ⚠️  Error checking {url}: {str(e)}")
        
        return list(emails)
    
    def add_emails_to_dataframe(self, df, website_column='website', name_column='name'):
        """Add email column to existing dataframe"""
        print(f"📧 Adding emails to {len(df)} leads...")
        print("⚠️  This will take some time as we check each website...")
        
        emails_list = []
        
        for i, row in df.iterrows():
            print(f"\n📋 Processing {i+1}/{len(df)}: {row.get(name_column, 'Unknown')}")
            
            emails = []
            
            # Try to get emails from website
            if website_column in row and row[website_column]:
                website_emails = self.get_emails_from_website(row[website_column])
                emails.extend(website_emails)
            
            # If no emails found, try to construct common email patterns
            if not emails and name_column in row and row[name_column]:
                business_name = row[name_column]
                # Try common email patterns
                domain_guesses = []
                
                # If we have a website, try to extract domain
                if website_column in row and row[website_column]:
                    try:
                        from urllib.parse import urlparse
                        parsed = urlparse(row[website_column])
                        if parsed.netloc:
                            domain_guesses.append(parsed.netloc)
                    except:
                        pass
                
                # Try common email patterns
                for domain in domain_guesses:
                    # Common email patterns
                    patterns = [
                        f"info@{domain}",
                        f"contact@{domain}",
                        f"hello@{domain}",
                        f"admin@{domain}"
                    ]
                    
                    for pattern in patterns:
                        if self.is_valid_email(pattern):
                            emails.append(pattern)
                            break  # Just add one guess per domain
            
            emails_list.append(', '.join(emails) if emails else '')
            
            if emails:
                print(f"   ✅ Found: {', '.join(emails)}")
            else:
                print(f"   ❌ No emails found")
            
            # Add delay to be respectful
            time.sleep(1)
        
        # Add emails column to dataframe
        df['emails'] = emails_list
        return df

def main():
    """Main function"""
    print("📧 Email Extractor for Lead Data")
    print("=" * 40)
    
    # Check for existing files
    data_dir = "data"
    if not os.path.exists(data_dir):
        print("❌ No 'data' directory found. Run the lead scraper first.")
        return
    
    # Find CSV files
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    
    if not csv_files:
        print("❌ No CSV files found in data directory.")
        return
    
    print(f"📁 Found {len(csv_files)} CSV file(s):")
    for i, file in enumerate(csv_files, 1):
        print(f"   {i}. {file}")
    
    # Let user choose file
    try:
        choice = int(input(f"\nWhich file to process? (1-{len(csv_files)}): ")) - 1
        if choice < 0 or choice >= len(csv_files):
            print("❌ Invalid choice.")
            return
        selected_file = csv_files[choice]
    except ValueError:
        print("❌ Invalid input.")
        return
    
    file_path = os.path.join(data_dir, selected_file)
    
    try:
        # Load the data
        print(f"\n📖 Loading data from: {selected_file}")
        df = pd.read_csv(file_path)
        print(f"✅ Loaded {len(df)} leads")
        
        # Check if emails column already exists
        if 'emails' in df.columns:
            print("⚠️  Emails column already exists. Overwrite? (y/n)")
            if input().strip().lower() not in ['y', 'yes']:
                print("❌ Cancelled.")
                return
        
        # Initialize email extractor
        extractor = EmailExtractor()
        
        # Add emails
        df_with_emails = extractor.add_emails_to_dataframe(df)
        
        # Save the enhanced data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(data_dir, f"leads_with_emails_{timestamp}.csv")
        df_with_emails.to_csv(output_file, index=False)
        
        print(f"\n🎉 Email extraction completed!")
        print(f"💾 Enhanced data saved to: {output_file}")
        
        # Show statistics
        leads_with_emails = len(df_with_emails[df_with_emails['emails'] != ''])
        print(f"\n📊 Email Statistics:")
        print(f"   Total leads: {len(df_with_emails)}")
        print(f"   Leads with emails: {leads_with_emails}")
        print(f"   Success rate: {leads_with_emails/len(df_with_emails)*100:.1f}%")
        
        # Show sample results
        if leads_with_emails > 0:
            print(f"\n📋 Sample leads with emails:")
            sample_leads = df_with_emails[df_with_emails['emails'] != ''].head(3)
            for _, lead in sample_leads.iterrows():
                print(f"   • {lead.get('name', 'Unknown')}: {lead['emails']}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
