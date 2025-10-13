#!/usr/bin/env python3
"""
Combine all lead files with emails into one master file
"""

import pandas as pd
import os
from datetime import datetime

def combine_lead_files():
    """Combine all lead files with emails"""
    
    data_dir = "data"
    
    # Find all files with emails
    email_files = [f for f in os.listdir(data_dir) if f.startswith('leads_with_emails_') and f.endswith('.csv')]
    
    if not email_files:
        print("❌ No email files found.")
        return
    
    print(f"📁 Found {len(email_files)} email files:")
    for i, file in enumerate(email_files, 1):
        print(f"   {i}. {file}")
    
    all_leads = []
    
    for file in email_files:
        file_path = os.path.join(data_dir, file)
        print(f"\n📖 Loading: {file}")
        
        try:
            df = pd.read_csv(file_path)
            print(f"   ✅ Loaded {len(df)} leads")
            all_leads.append(df)
        except Exception as e:
            print(f"   ❌ Error loading {file}: {e}")
    
    if not all_leads:
        print("❌ No data loaded.")
        return
    
    # Combine all dataframes
    print(f"\n🔄 Combining {len(all_leads)} files...")
    combined_df = pd.concat(all_leads, ignore_index=True)
    
    # Remove duplicates based on place_id
    print(f"📊 Before deduplication: {len(combined_df)} leads")
    combined_df = combined_df.drop_duplicates(subset=['place_id'], keep='first')
    print(f"📊 After deduplication: {len(combined_df)} leads")
    
    # Sort by business type and name
    combined_df = combined_df.sort_values(['query_used', 'name'])
    
    # Save combined file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(data_dir, f"ALL_LEADS_WITH_EMAILS_{timestamp}.csv")
    combined_df.to_csv(output_file, index=False)
    
    print(f"\n🎉 Combined file created!")
    print(f"💾 Saved to: {output_file}")
    
    # Show statistics
    total_leads = len(combined_df)
    leads_with_emails = len(combined_df[combined_df['emails'] != ''])
    
    print(f"\n📊 Final Statistics:")
    print(f"   Total unique leads: {total_leads}")
    print(f"   Leads with emails: {leads_with_emails}")
    print(f"   Success rate: {leads_with_emails/total_leads*100:.1f}%")
    
    # Show breakdown by business type
    print(f"\n📋 Breakdown by business type:")
    for query in combined_df['query_used'].unique():
        query_leads = combined_df[combined_df['query_used'] == query]
        query_with_emails = len(query_leads[query_leads['emails'] != ''])
        print(f"   {query}: {len(query_leads)} leads ({query_with_emails} with emails)")
    
    # Show sample results
    print(f"\n📋 Sample leads with emails:")
    sample_leads = combined_df[combined_df['emails'] != ''].head(5)
    for _, lead in sample_leads.iterrows():
        print(f"   • {lead['name']} ({lead['query_used']}): {lead['emails']}")
    
    return output_file

if __name__ == "__main__":
    combine_lead_files()
