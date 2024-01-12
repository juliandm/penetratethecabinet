import json
from google_images_search import GoogleImagesSearch

# Replace these with your Google Custom Search API key and CX
your_dev_api_key = os.environ.get('GOOGLE_API_KEY=')
your_project_cx = "006863545528577858039:0nolajxzv2m"

# Initialize GoogleImagesSearch object
gis = GoogleImagesSearch(your_dev_api_key, your_project_cx)

# Load the JSON file
with open('src/data/people.json', 'r') as file:
    people = json.load(file)

# Directory to save images
download_path = '/path/to/download/'  # Replace with your desired download path

# Iterate through each person in the JSON file
for person in people:
    print(f"Downloading image for {person['name']}...")
    search_query = f"{person['name']} {person['title']}"  # Construct search query
    _search_params = {
        'q': search_query,
        'num': 1,
        'fileType': 'jpg|gif|png',
        'imgSize': 'large',
        'imgType': 'photo'
    }

    # Search and download
    gis.search(search_params=_search_params, path_to_dir=download_path)

    # Assuming only one image is fetched, rename it to use the person's ID
    if gis.results():
        first_image = gis.results()[0]
        image_path = first_image.path
        new_image_path = f"{download_path}{person['id']}.jpg"
        os.rename(image_path, new_image_path)
        print(f"Downloaded image for {person['name']} to {new_image_path}")
    else:
        print(f"No results found for {person['name']}")
