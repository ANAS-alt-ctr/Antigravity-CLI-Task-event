---
phase: 3
plan: 3
wave: 1
---

# Plan 3.1: Dynamic Integration & Refresh

## Objective
Implement client-side JavaScript to fetch release data from the Flask API, render cards dynamically, and implement real-time search, filter tags, and interactive loading states.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- templates/index.html
- static/style.css

## Tasks

<task type="auto">
  <name>Create JavaScript application logic</name>
  <files>static/app.js</files>
  <action>
    Create `static/app.js` implementing:
    1. **State Management**: Store the full list of releases and current filter/search states.
    2. **Feed Fetching**: A function `fetchReleases()` that hits the `/api/releases` endpoint. It handles showing the loading spinner, managing the cards container visibility, and rendering the error state if the fetch fails.
    3. **Card Rendering**: Dynamically generate card elements with:
       - Date and appropriate Badge style (e.g. `badge-feature` for Feature, `badge-bugfix` for Bug Fix, etc.).
       - Sanitize content slightly (or insert directly as we parse clean HTML on the backend).
       - An SVG Tweet button and Link button.
       - A custom mousemove event handler on each card to calculate hover coordinate variables (`--x`, `--y`) for the dynamic glowing effect.
    4. **Refreshes & Actions**: Wire up the "Refresh" button click handler to fetch data again.
    5. **Filtering & Searching**: Add event listeners to:
       - Search bar (filtering elements whose content, date, or type matches search text).
       - Filter buttons (active class toggle, filter cards by type).
  </action>
  <verify>Check static/app.js exists and syntax is correct</verify>
  <done>static/app.js handles API calls, filtering, searching, and custom hover styles</done>
</task>

## Success Criteria
- [ ] Release notes are fetched asynchronously from the API on page load.
- [ ] Searching and filter buttons update the visible cards immediately.
- [ ] Spinner is displayed during initial loading and refresh actions.
