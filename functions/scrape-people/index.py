import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os

# Define the maximum number of retry attempts
max_retries = 3
retry_delay_seconds = 20

def make_request(url, use_proxy=True):
    for retry_count in range(max_retries + 1):
        try:
            response = call_proxy(url) if use_proxy else simple_request(url)
            if response:
                return response
        except Exception as e:
            print(f"Error occurred (Attempt {retry_count + 1}): {e}")
        
        if retry_count < max_retries:
            # Wait for some time before the next retry (you can adjust the delay as needed)
            print(f"Retrying in {retry_delay_seconds} seconds...")
            time.sleep(retry_delay_seconds)
    
    print(f"Maximum retry attempts reached ({max_retries}), giving up.")
    return None

def simple_request(url):
    response = requests.get(url, timeout=request_timeout)

    if response.status_code != 200:
        print(f"Request failed with status code {response.status_code}")
        return None
    return response.content

def call_proxy(url):
    oxy_url = 'https://realtime.oxylabs.io/v1/queries'

    # Define the authentication credentials
    username = 'juliandm'
    password = os.environ.get('OXYLABS_PASSWORD')

    # Define the headers
    headers = {
        'Content-Type': 'application/json',
    }

    # Define the payload data
    payload = {
        'source': 'universal',
        'url': url,
        # 'geo_location': 'United States',
    }
    response = requests.post(oxy_url, auth=(username, password), headers=headers, json=payload)
    if response.status_code != 200:
        print(f"Request failed with status code {response.status_code}")
        print(response.reason)
        return None
    response_json = response.json()
    return response_json["results"][0]["content"]
    # Implement your logic to get a proxy from the 'https://realtime.oxylabs.io/v1/queries' endpoint here
    # Use the provided parameters for authentication and other details

def get_archived_urls(original_url):
    api_url = f"http://web.archive.org/cdx/search/cdx?url={original_url}&output=json&collapse=timestamp:6&fl=timestamp,original"
    print(f"Getting archived urls for {original_url}")
    response = make_request(api_url, True)
    archived_urls = [original_url]
    if response:
        try:
            data = json.loads(response)
            if len(data) == 0:
                return archived_urls
            for item in data[1:]:  # Skip the first row as it's headers
                timestamp, archived_url = item[0], item[1]
                archived_urls.append(f'https://web.archive.org/web/{timestamp}/{archived_url}')
        except Exception as e:
            print(response)
            print(f"Json parse failed")

    return archived_urls

def scrape_person_info(url):
    print(f"Scraping {url}")
    response = make_request(url, True)
    if response:
        soup = BeautifulSoup(response, 'html.parser')
        title = soup.find('p', class_='person__meta').get_text(strip=True) if soup.find('p', class_='person__meta') else ''
        description = soup.find('div', class_='page__content').get_text(strip=True) if soup.find('div', class_='page__content') else ''

        return {
            'title': title,
            'description': description
        }
    return None

def handler(inputs):
    file_path = inputs["file"]
    limit = int(inputs.get("limit") or 100) 
    cursor = int(inputs.get("cursor") or 0) 
    # existing implementation remains the same...

    with open(file_path, 'r') as file:
        people = json.load(file)

    processed_count = 0
    processed_count_total = 0
    print(f"Processing {len(people)} people")
    try:
        for index, person in enumerate(people, start=1):
            if person.get('description'):
                continue

            if index < cursor:
                continue

            if processed_count >= limit:
                print(f"Processed limit {processed_count} people, exiting...")
                break

            print("processing", person["name"])
            archived_urls = get_archived_urls(person['link'])
            if len(archived_urls) == 0:
                print(f"No archived urls found for {person['name']}")
                continue
            print(f"Found {len(archived_urls)} archived urls for {person['name']}")
            for url in archived_urls:  # Iterate from the oldest to newest
                person_info = scrape_person_info(url)
                if person_info and person_info['title']:
                    print("found description", person_info['description'])
                    person['description'] = person_info['description']
                    person['source'] = url  # Adding the Wayback Machine URL as the source
                    if not person['title']:  # Update the title if it's empty
                        person['title'] = person_info['title']
                    break  # Break the loop if information is found

            processed_count_total = index
            processed_count += 1
            if processed_count % 5 == 0:
                # Save progress every 5 processed entries
                with open(file_path, 'w') as file:
                    json.dump(people, file, indent=4)
                print(f'Saved progress after processing {processed_count} people')

        # Save the final state after finishing all people
        with open(file_path, 'w') as file:
            json.dump(people, file, indent=4)

    except Exception as e:
        print(f"Error occurred: {e}")

    with open(file_path, 'w') as file:
        json.dump(people, file, indent=4)
    print(f'Updated information for {processed_count} people')
    return {
        'file': file_path,
    }

if __name__ == '__main__':
    handler({
        "file": "../tests/full.json",
        "cursor": 1000,
    })