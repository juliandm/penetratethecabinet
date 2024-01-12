import requests
from bs4 import BeautifulSoup
import json

def get_archived_urls(domain, endpoint):
    # Wayback Machine API endpoint
    url = f"http://web.archive.org/cdx/search/cdx?url={domain}/{endpoint}&output=json"
    response = requests.get(url)
    urls = []

    if response.status_code == 200:
        archives = response.json()
        for archive in archives[1:]:  # Skip the first row as it's headers
            timestamp, original_url = archive[1], archive[2]
            archived_url = f'https://web.archive.org/web/{timestamp}/{original_url}'
            urls.append(archived_url)

    return urls

def scrape_biography(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Add your code here to find and extract the biography information
        # For example:
        # bio = soup.find('div', class_='biography').get_text(strip=True)
        # return bio
    return None

def main():
    domain = 'https://www.weforum.org'
    endpoint = 'people'
    urls = get_archived_urls(domain, endpoint)
    biographies = []

    for url in urls:
        bio = scrape_biography(url)
        if bio:
            biographies.append(bio)

    with open('biographies.json', 'w') as file:
        json.dump(biographies, file, indent=4)

    print(f'Biographies extracted: {len(biographies)}')

if __name__ == '__main__':
    main()
