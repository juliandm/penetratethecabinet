from bs4 import BeautifulSoup
import json

# Path to your HTML file
file_path = 'example.html'

# Read the HTML content from the file
with open(file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Find all table rows
rows = soup.find_all('tr', class_='clickable-row')

# List to hold extracted information
data = []

# Extract information from each row
for row in rows:
    name = row.find('td', class_='name').get_text(strip=True)
    title = row.find('td', class_='title').get_text(strip=True)
    link_tag = row.find('a', href=True)
    link = link_tag['href'] if link_tag else None

    data.append({
        'name': name,
        'title': title,
        'link': link
    })

# Write data to a JSON file
with open('extracted_data.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=4)

print("Data extracted and saved to extracted_data.json")
