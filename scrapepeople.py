import requests
from bs4 import BeautifulSoup
import json
import time

import requests
from bs4 import BeautifulSoup
import time

file_path = './src/data/people.json'

def make_request_with_retry(url):
    max_retries = 5
    for attempt in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response
            else:
                print(f"Request failed with status code {response.status_code}. Retrying in 20 seconds...")
        except requests.RequestException as e:
            print(f"An error occurred: {e}. Retrying in 20 seconds...")

        time.sleep(20)
    time.sleep(5)
    print("Max retries reached. Returning None.")
    return None

def get_archived_urls(original_url):
    api_url = f"http://web.archive.org/cdx/search/cdx?url={original_url}&output=json&collapse=timestamp:6&fl=timestamp,original"
    response = make_request_with_retry(api_url)
    archived_urls = []
    if response:
        data = response.json()
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


def main():
    with open(file_path, 'r') as file:
        people = json.load(file)

    start_from = 100  # Adjust this to choose the starting point (1-based index)
    processed_count = start_from

    for index, person in enumerate(people, start=1):
        if index < start_from:
            continue  # Skip entries until the specified starting point
        print("processing", person["name"])
        archived_urls = get_archived_urls(person['link'])
        for url in archived_urls[::-1]:  # Iterate from the oldest to newest
            person_info = scrape_person_info(url)
            if person_info and person_info['description']:
                person['description'] = person_info['description']
                if not person['title']:  # Update the title if it's empty
                    person['title'] = person_info['title']
                break  # Break the loop if information is found

        processed_count += 1
        if processed_count % 5 == 0:
            # Save progress every 10 processed entries
            with open(file_path, 'w') as file:
                json.dump(people, file, indent=4)
            print(f'Saved progress after processing {processed_count} people')
    # Save the final state after finishing all people
    with open(file_path, 'w') as file:
        json.dump(people, file, indent=4)

    print(f'Updated information for {len(people)} people')

if __name__ == '__main__':
    main()
