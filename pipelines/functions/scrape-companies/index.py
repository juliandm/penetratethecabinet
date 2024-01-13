from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import time

def scrape_organization_info(url, driver):
    driver.get(url)
    time.sleep(3)  # Wait for JavaScript to load
    print("processing", url)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Extracting various elements based on their class names
    organization_name = soup.find('h1', class_='organization__name').get_text(strip=True) if soup.find('h1', class_='organization__name') else ''
    headquarters = soup.find('dt', string='Headquarters').find_next_sibling('dd').get_text(strip=True) if soup.find('dt', string='Headquarters') else ''
    description = soup.find('div', class_='organization__description').get_text(strip=True) if soup.find('div', class_='organization__description') else ''
    website_link = soup.find('a', class_='organization__website--dark')['href'] if soup.find('a', class_='organization__website--dark') else ''

    return {
        'name': organization_name,
        'headquarters': headquarters,
        'description': description,
        'website': website_link
    }

def main():
    # Load the organization data from the JSON file
    with open('src/data/companies.json', 'r') as file:
        organizations = json.load(file)

    # Set up Selenium with a headless browser
    options = Options()
    options.headless = True
    driver = webdriver.Chrome(options=options)

    scraped_data = []
    for org in organizations:
        print("Processing", org["name"])
        org_info = scrape_organization_info(org['link'], driver)
        if org_info:
            scraped_data.append(org_info)

    driver.quit()  # Close the browser

    # Write the scraped data to an output file
    with open('scraped_organizations.json', 'w') as file:
        json.dump(scraped_data, file, indent=4)

    print(f'Scraped data for {len(scraped_data)} organizations')

if __name__ == '__main__':
    main()
