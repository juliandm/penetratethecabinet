import json
import os
import boto3
from google_images_search import GoogleImagesSearch

# Replace these with your Google Custom Search API key and CX
your_dev_api_key = os.environ.get('GOOGLE_API_KEY')
your_project_cx = "006863545528577858039:0nolajxzv2m"

# Initialize GoogleImagesSearch object
gis = GoogleImagesSearch(your_dev_api_key, your_project_cx)

# Load the JSON file
with open('src/data/people.json', 'r') as file:
    people = json.load(file)

# Initialize boto3 S3 client
s3_client = boto3.client('s3')
bucket_name = 'wef-images'  # Replace with your bucket name

# Iterate through each person in the JSON file
for per_index, person in enumerate(people):
    if per_index < 0:
        continue
    print(f"Downloading image for {person['name']}... at index {per_index}")
    search_query = f"{person['name']}"  # Construct search query
    _search_params = {
        'q': search_query,
        'num': 1,
        'fileType': 'jpg',
        # 'imgSize': 'large',
        # 'imgType': 'face'
    }

    # Search and download
    gis.search(search_params=_search_params, path_to_dir='/tmp/', custom_image_name=person['id'])

    # Assuming only one image is fetched, rename it to use the person's ID
    if gis.results():
        local_file_path = gis.results()[0].path
        print(f"Downloaded {local_file_path}")

        # Upload to s3
        s3_key = f"images/{person['id']}.jpg"  # S3 object key
        s3_client.upload_file(local_file_path, bucket_name, s3_key)
        print(f"Uploaded {local_file_path} to s3://{bucket_name}/{s3_key}")

    else:
        print(f"No results found for {person['name']}")
