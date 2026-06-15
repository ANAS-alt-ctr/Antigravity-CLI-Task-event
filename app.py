import sys
import argparse
import urllib.request
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def fetch_and_parse_feed():
    try:
        # Fetch RSS/Atom feed XML with a User-Agent to avoid blocking
        req = urllib.request.Request(
            FEED_URL, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        # Parse XML
        namespaces = {'atom': 'http://www.w3.org/2005/Atom'}
        root = ET.fromstring(xml_data)
        
        releases = []
        
        for entry in root.findall('atom:entry', namespaces):
            date_str = entry.find('atom:title', namespaces).text
            link_el = entry.find('atom:link[@rel="alternate"]', namespaces)
            if link_el is None:
                link_el = entry.find('atom:link', namespaces)
            link = link_el.attrib.get('href', '') if link_el is not None else ''
            
            content_el = entry.find('atom:content', namespaces)
            if content_el is None or not content_el.text:
                continue
                
            content_html = content_el.text
            
            # Split the entry's HTML content by <h3> headers
            soup = BeautifulSoup(content_html, 'html.parser')
            current_type = "Update"
            current_desc_elements = []
            item_idx = 0
            
            def add_release(type_str, elements, idx):
                if not elements:
                    return
                html_content = "".join(str(el) for el in elements).strip()
                # Create a unique ID
                clean_date = date_str.replace(' ', '_').replace(',', '')
                unique_id = f"{clean_date}_{idx}"
                releases.append({
                    'id': unique_id,
                    'date': date_str,
                    'type': type_str.strip(),
                    'content': html_content,
                    'link': link
                })

            for element in soup.contents:
                if element.name == 'h3':
                    if current_desc_elements:
                        add_release(current_type, current_desc_elements, item_idx)
                        item_idx += 1
                        current_desc_elements = []
                    current_type = element.get_text(strip=True)
                else:
                    # Keep valid HTML elements or non-empty strings
                    if element.name or (isinstance(element, str) and element.strip()):
                        current_desc_elements.append(element)
            
            # Add the last release note item under this entry
            if current_desc_elements:
                add_release(current_type, current_desc_elements, item_idx)
                
        return releases, None
    except Exception as e:
        return [], str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/releases')
def get_releases():
    releases, error = fetch_and_parse_feed()
    if error:
        return jsonify({'success': False, 'error': error}), 500
    return jsonify({'success': True, 'releases': releases})

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="BigQuery Release Notes Server")
    parser.add_argument('--test-parse', action='store_true', help="Test parse the XML feed and output first 3 entries")
    args = parser.parse_args()
    
    if args.test_parse:
        print("Testing feed fetching and parsing...")
        releases, error = fetch_and_parse_feed()
        if error:
            print(f"Error: {error}")
            sys.exit(1)
        print(f"Successfully parsed {len(releases)} release notes.")
        print("\nFirst 3 parsed items:")
        for r in releases[:3]:
            print("-" * 50)
            print(f"ID:      {r['id']}")
            print(f"Date:    {r['date']}")
            print(f"Type:    {r['type']}")
            print(f"Link:    {r['link']}")
            print(f"Content: {r['content'][:150]}...")
        print("-" * 50)
        sys.exit(0)
        
    app.run(debug=True, port=5000)
