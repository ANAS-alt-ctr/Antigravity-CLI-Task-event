---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Backend Foundation

## Objective
Set up the Python Flask backend, implement RSS/Atom feed parsing for Google BigQuery release notes, and expose a JSON API endpoint.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md

## Tasks

<task type="auto">
  <name>Create backend dependencies</name>
  <files>requirements.txt</files>
  <action>
    Create a `requirements.txt` file listing Flask, requests, and beautifulsoup4.
  </action>
  <verify>cat requirements.txt</verify>
  <done>requirements.txt is created with correct dependencies</done>
</task>

<task type="auto">
  <name>Create Flask application and XML feed parser</name>
  <files>app.py</files>
  <action>
    Implement a Flask application in `app.py` that:
    1. Fetches the feed from `https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`
    2. Parses the XML Atom feed using `xml.etree.ElementTree` or `BeautifulSoup`.
    3. Splits each daily entry's HTML content by release note item (using `BeautifulSoup` to parse `<h3>` tags and their subsequent paragraphs/elements).
    4. Structures each release note as an object containing:
       - id: unique identifier (combination of date and type/index)
       - date: the title of the entry (e.g. "June 15, 2026")
       - type: the category (e.g., "Feature", "Deprecation", "Bug Fix", etc.)
       - content: the HTML description of that specific update
       - link: the permalink of the daily entry
    5. Serves static files and renders `index.html`.
    6. Exposes a `/api/releases` JSON API endpoint.
  </action>
  <verify>python app.py --test-parse</verify>
  <done>app.py implements the required API and parses release notes successfully</done>
</task>

## Success Criteria
- [ ] API endpoint `/api/releases` returns a list of parsed release notes in JSON format.
