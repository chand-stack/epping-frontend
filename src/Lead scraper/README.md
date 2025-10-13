# Lead Scraper

A Python-based lead generation tool that uses Google Places API to extract business information for marketing and sales purposes.

## 🚀 Quick Start

### 1. Setup
```bash
# Install dependencies and setup
python setup.py
```

### 2. Configure
Edit `config.py` to customize:
- Search queries (what businesses to find)
- Target location
- Number of results
- Output preferences

### 3. Run
```bash
python lead_scraper.py
```

## 📋 What You Need

### Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Places API"
4. Create credentials (API Key)
5. Add your API key to the `.env` file

### Environment File (.env)
```
GOOGLE_API_KEY=your_api_key_here
DEBUG=false
```

## 🔧 Configuration

Edit `config.py` to customize your scraper:

```python
# What to search for
SEARCH_QUERIES = [
    "restaurants",
    "coffee shops",
    "food delivery"
]

# Where to search
DEFAULT_LOCATION = "London, UK"

# How many results
MAX_RESULTS_PER_QUERY = 10
```

## 📊 Output

The scraper saves results in two formats:
- **CSV file**: `data/leads_YYYYMMDD_HHMMSS.csv`
- **Excel file**: `data/leads_YYYYMMDD_HHMMSS.xlsx`

### Data Fields
- Business name
- Address
- Phone number
- Website
- Rating & reviews
- Price level
- Business type
- Google Place ID

## 🛠️ Customization

### Adding New Search Terms
Edit `config.py` and add to `SEARCH_QUERIES`:
```python
SEARCH_QUERIES = [
    "your new search term",
    "another search term"
]
```

### Changing Location
Update `DEFAULT_LOCATION` in `config.py`:
```python
DEFAULT_LOCATION = "New York, NY"  # or any city/area
```

### Filtering Results
You can filter by:
- Minimum rating
- Maximum price level
- Business types

## ⚠️ Important Notes

1. **API Limits**: Google Places API has usage limits. The scraper includes delays to respect these limits.

2. **Rate Limiting**: Don't run the scraper too frequently to avoid hitting API quotas.

3. **API Key Security**: Never commit your `.env` file to version control.

4. **Costs**: Google Places API charges per request. Monitor your usage in Google Cloud Console.

## 🐛 Troubleshooting

### "API key not found" error
- Check your `.env` file exists
- Verify `GOOGLE_API_KEY=` is in the file
- Make sure there are no extra spaces

### "Places API not enabled" error
- Go to Google Cloud Console
- Enable the "Places API" for your project

### No results found
- Check your search queries in `config.py`
- Verify the location is correct
- Try broader search terms

## 📁 Project Structure

```
Lead scraper/
├── .env                 # API keys and settings
├── config.py           # Configuration options
├── lead_scraper.py     # Main scraper script
├── setup.py            # Setup script
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── data/              # Output folder
    └── leads_*.csv    # Generated lead files
```

## 🔄 Next Steps

1. **Customize**: Edit `config.py` for your specific needs
2. **Test**: Run with a small number of results first
3. **Scale**: Increase results once you're satisfied
4. **Automate**: Set up scheduled runs for regular lead generation

## 💡 Tips

- Start with 5-10 results per query to test
- Use specific search terms for better quality leads
- Check the generated files to ensure data quality
- Consider the business hours of your target businesses
