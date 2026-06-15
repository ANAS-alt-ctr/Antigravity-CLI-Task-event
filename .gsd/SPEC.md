# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A premium, dark-mode web application built with Python Flask and vanilla front-end technologies (HTML, CSS, JS) that aggregates Google BigQuery release notes from its official XML feed. It enables developers and data engineers to browse, filter, refresh, and quickly share specific updates to Twitter (X) using Web Intents.

## Goals
1. **Feed Aggregation**: Fetch and parse the BigQuery release notes XML feed dynamically.
2. **Premium Interface**: A modern, high-aesthetic Glassmorphic Dark Mode interface to display updates with smooth transitions and animations.
3. **Interactive Refresh**: A manual refresh button with a loading spinner to fetch updates asynchronously.
4. **Social Sharing**: A feature to select a release note card and open a pre-filled Twitter/X intent for sharing.

## Non-Goals (Out of Scope)
- Automated Twitter publishing via API keys (avoids complex developer credentials setup).
- Persistent database storage of release notes (caching in-memory or fetching on-demand is sufficient for this version).
- User authentication/login.

## Users
Developers, data engineers, and cloud architects who want to stay updated on Google BigQuery developments and share interesting releases with their community.

## Constraints
- **Backend**: Python Flask (using standard libraries for XML parsing, or lightweight ones like `feedparser` if preferred, or built-in `xml.etree.ElementTree`).
- **Frontend**: Plain vanilla HTML, CSS, and JS (No Tailwind, React, etc.).
- **Styling**: Sleek Dark Mode with Glassmorphism, smooth animations, responsive layout.

## Success Criteria
- [ ] Feed is fetched and parsed correctly from the Google feed URL.
- [ ] Release notes are rendered in a clean, scrollable layout with tags (e.g., Feature, Deprecation, Bug Fix, etc. if available in the text, or categorized by date/type).
- [ ] Refresh button fetches the feed asynchronously via an API endpoint and displays a spinner during load.
- [ ] "Tweet" button opens a Twitter/X Web Intent pre-filled with the title, brief description, and official link.
