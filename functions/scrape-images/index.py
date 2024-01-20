import json
import os
import boto3
from google_images_search import GoogleImagesSearch

# Replace these with your Google Custom Search API key and CX
your_dev_api_key = os.environ.get('GOOGLE_API_KEY')
your_project_cx = "006863545528577858039:0nolajxzv2m"
bucket_name = os.environ.get('BUCKET_NAME') or 'wef-images'
# Initialize GoogleImagesSearch object
gis = GoogleImagesSearch(your_dev_api_key, your_project_cx)
s3_client = boto3.client('s3')

def process_person(person):
    print(f"Downloading image for {person['name']}...")
    search_query = f"{person['name']}"  # Construct search query
    _search_params = {
        'q': search_query,
        'num': 1,
        'fileType': 'jpg',
        # 'imgSize': 'large',
        # 'imgType': 'face'
    }
    tmp_dir = os.environ.get("TMP_DIR") or './tmp/images'
    # Search and download
    gis.search(search_params=_search_params, path_to_dir=tmp_dir, custom_image_name=person['id'])

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

def handler(inputs):
    people_path = inputs["people"]
    processed_path = inputs["processed"]
    limit = int(inputs.get("limit") or 100)
    
    new_processed = []
    # Load the JSON file
    with open(people_path, 'r') as file:
        people = json.load(file)
    
    # Load the processed count
    with open(processed_path, 'r') as file:
        processed = json.load(file)
    try:
        # Iterate through each person in the JSON file
        for per_index, person in enumerate(people):
            if per_index >= limit:
                print(f"Processed limit {limit} people, exiting...")
                break
            person_id = person['id']
            if person_id in processed:
                print(f"Skipping {person['name']} as it has already been processed")
                continue
            process_person(person)
            new_processed.append(person_id)
    except Exception as e:
        print(e)
    
    all_processed = processed + new_processed
    # Save the processed count
    with open(processed_path, 'w') as file:
        json.dump(all_processed, file, indent=4)

    print(f"Processed {len(new_processed)} people")
    return {
        "processed": processed_path
    }
if __name__ == '__main__':
    handler({
        "people": "../tests/test.json",
        "processed": "../tests/processed-images.json",
        "limit": 10
    })
