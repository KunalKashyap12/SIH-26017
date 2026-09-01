# Approximate latitude and longitude for districts in the dataset

DISTRICT_COORDINATES = {
    # Maharashtra
    "Pune": {"lat": 18.5204, "lng": 73.8567},
    "Thane": {"lat": 19.2183, "lng": 72.9781},
    "Nagpur": {"lat": 21.1458, "lng": 79.0882},
    # Uttar Pradesh
    "Lucknow": {"lat": 26.8467, "lng": 80.9462},
    "Varanasi": {"lat": 25.3176, "lng": 82.9739},
    "Agra": {"lat": 27.1767, "lng": 78.0081},
    # Tamil Nadu
    "Chennai": {"lat": 13.0827, "lng": 80.2707},
    "Coimbatore": {"lat": 11.0168, "lng": 76.9558},
    "Madurai": {"lat": 9.9252, "lng": 78.1198},
    # Gujarat
    "Ahmedabad": {"lat": 23.0225, "lng": 72.5714},
    "Surat": {"lat": 21.1702, "lng": 72.8311},
    "Vadodara": {"lat": 22.3072, "lng": 73.1812},
    # Karnataka
    "Bengaluru Urban": {"lat": 12.9716, "lng": 77.5946},
    "Mysuru": {"lat": 12.2958, "lng": 76.6394},
    "Belagavi": {"lat": 15.8497, "lng": 74.4977},
    # Rajasthan
    "Jaipur": {"lat": 26.9124, "lng": 75.7873},
    "Jodhpur": {"lat": 26.2389, "lng": 73.0243},
    "Udaipur": {"lat": 24.5854, "lng": 73.7125},
    # Andhra Pradesh
    "Visakhapatnam": {"lat": 17.6868, "lng": 83.2185},
    "Vijayawada": {"lat": 16.5062, "lng": 80.6480},
    "Guntur": {"lat": 16.3067, "lng": 80.4365},
    # Odisha
    "Khordha": {"lat": 20.1837, "lng": 85.6160},
    "Cuttack": {"lat": 20.4625, "lng": 85.8828},
    "Sambalpur": {"lat": 21.4669, "lng": 83.9812},
    # Madhya Pradesh
    "Bhopal": {"lat": 23.2599, "lng": 77.4126},
    "Indore": {"lat": 22.7196, "lng": 75.8577},
    "Gwalior": {"lat": 26.2183, "lng": 78.1828},
    # West Bengal
    "Kolkata": {"lat": 22.5726, "lng": 88.3639},
    "Howrah": {"lat": 22.5958, "lng": 88.2636},
    "North 24 Parganas": {"lat": 22.7230, "lng": 88.4795},
}


def get_district_coords(district_name: str) -> dict:
    """Returns approximate lat/lng for a district."""
    return DISTRICT_COORDINATES.get(district_name, {"lat": 20.5937, "lng": 78.9629})  # Default center of India
