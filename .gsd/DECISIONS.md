# DECISIONS.md — Architectural Decisions Log

## ADR-01: Twitter Integration Approach
- **Status**: Accepted
- **Context**: The application needs the ability to share specific updates to Twitter.
- **Decision**: Use Twitter Web Intents (`https://twitter.com/intent/tweet?text=...`) instead of the Twitter API.
- **Rationale**: The Twitter API requires API keys, OAuth configuration, and developer accounts, which adds significant setup overhead for the user. Web Intents run entirely in the browser and allow the user to preview, edit, and post the tweet directly using their existing browser session.

## ADR-02: Feed XML Parsing
- **Status**: Accepted
- **Context**: The feed is at `https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`.
- **Decision**: Parse XML on the Flask backend using Python's built-in `xml.etree.ElementTree` or `urllib.request` + `feedparser` if installed.
- **Rationale**: Parsing on the backend avoids CORS issues that occur if we attempt to fetch the XML feed directly from the frontend JS. Using `feedparser` or built-in elements makes the code robust.
