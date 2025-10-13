"""
Configuration file for Lead Scraper
Customize these settings for your specific needs
"""

# Search Configuration
SEARCH_QUERIES = [
    "restaurants",
    "coffee shops", 
    "food delivery",
    "cafes",
    "fast food",
    "pizza",
    "burgers",
    "asian restaurants",
    "italian restaurants"
]

# Location Configuration
DEFAULT_LOCATION = "London, UK"  # Change this to your target area
SEARCH_RADIUS = 5000  # Search radius in meters (5km)

# Results Configuration
MAX_RESULTS_PER_QUERY = 10  # Limit to avoid API rate limits
TOTAL_MAX_RESULTS = 100  # Overall limit for all queries

# Output Configuration
SAVE_CSV = True
SAVE_EXCEL = True
OUTPUT_DIRECTORY = "data"

# API Configuration
API_DELAY = 0.1  # Delay between API calls in seconds
MAX_RETRIES = 3  # Number of retries for failed requests

# Business Types to Focus On (optional filtering)
TARGET_BUSINESS_TYPES = [
    "restaurant",
    "food",
    "meal_takeaway",
    "meal_delivery",
    "cafe",
    "bakery"
]

# Minimum Rating Filter (optional)
MIN_RATING = 3.0  # Only include businesses with rating >= this value

# Price Level Filter (optional)
# 0 = Free, 1 = Inexpensive, 2 = Moderate, 3 = Expensive, 4 = Very Expensive
MAX_PRICE_LEVEL = 3  # Only include businesses with price level <= this value
