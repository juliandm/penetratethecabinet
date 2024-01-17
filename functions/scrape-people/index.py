import requests
from bs4 import BeautifulSoup
import json
import time

import requests
from bs4 import BeautifulSoup
import time
from json.decoder import JSONDecodeError


def make_request_with_retry(url):
    max_retries = 10
    for attempt in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response
            if response.status_code >= 400:
                print(f"Url not found.")
                return None
            else:
                print(response.reason)
                print(f"Request failed with status code {response.status_code}. Retrying in 20 seconds...")
        except JSONDecodeError as e:
            print(response.content)
            print(f"Json parse failed")
            return None
        except requests.RequestException as e:
            print(f"An error occurred: {e}. Retrying in 20 seconds...")
        time.sleep(30)
    time.sleep(5)
    raise Exception("Max retries reached.")

def get_archived_urls(original_url):
    api_url = f"http://web.archive.org/cdx/search/cdx?url={original_url}&output=json&collapse=timestamp:6&fl=timestamp,original"
    response = make_request_with_retry(api_url)
    archived_urls = []
    if response:
        data = response.json()
        if len(data) == 0:
            return []
        for item in data[1:]:  # Skip the first row as it's headers
            timestamp, archived_url = item[0], item[1]
            archived_urls.append(f'https://web.archive.org/web/{timestamp}/{archived_url}')
    return archived_urls

def scrape_person_info(url):
    response = make_request_with_retry(url)
    if response:
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.find('p', class_='person__meta').get_text(strip=True) if soup.find('p', class_='person__meta') else ''
        description = soup.find('div', class_='page__content').get_text(strip=True) if soup.find('div', class_='page__content') else ''

        return {
            'title': title,
            'description': description
        }
    return None


def handler(inputs):
    file_path = inputs["file"]
    limit = int(inputs["limit"]) or 100
    # existing implementation remains the same...

    with open(file_path, 'r') as file:
        people = json.load(file)

    processed_count = 0
    processed_count_total = 0
    try:
        for index, person in enumerate(people, start=1):
            if person['description']:
                continue

            if processed_count >= limit:
                print(f"Processed limit {processed_count} people, exiting...")
                break

            print("processing", person["name"])
            archived_urls = get_archived_urls(person['link'])
            for url in archived_urls[::-1]:  # Iterate from the oldest to newest
                person_info = scrape_person_info(url)
                if person_info and person_info['description']:
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
        "file": "src/data/people.json"
    })