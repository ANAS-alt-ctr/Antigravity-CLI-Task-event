# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Fetch and parse BigQuery Release notes XML feed dynamically.
- [ ] Premium Glassmorphic Dark Mode interface.
- [ ] Asynchronous refresh button with a spinner.
- [ ] Select release note and open pre-filled Twitter Web Intent.

## Phases

### Phase 1: Backend Foundation
**Status**: ⬜ Not Started
**Objective**: Build the Flask backend, implement RSS feed parsing, and create API endpoints.
**Tasks**:
- [ ] Set up project dependencies (`requirements.txt`)
- [ ] Create Flask application backend (`app.py`)
- [ ] Implement XML parser for BigQuery release notes feed
- [ ] Create `/api/releases` endpoint returning structured JSON
- [ ] Verify backend via API test (curl/browser request)

### Phase 2: Frontend Layout & Styling
**Status**: ⬜ Not Started
**Objective**: Create the HTML shell and a premium CSS style system (Glassmorphic Dark Mode).
**Tasks**:
- [ ] Create HTML skeleton (`templates/index.html`)
- [ ] Create CSS file (`static/style.css`) with curated dark theme tokens, glassmorphism card styles, and animations
- [ ] Verify static styling with dummy data

### Phase 3: Dynamic Integration & Refresh
**Status**: ⬜ Not Started
**Objective**: Connect frontend and backend, implement asynchronous refresh, search/filter, and spinner.
**Tasks**:
- [ ] Write JavaScript (`static/app.js`) to fetch releases from the backend
- [ ] Render release note cards dynamically with category badges (Feature, Bug Fix, Deprecation, etc.)
- [ ] Implement Refresh button with active spinner state transitions
- [ ] Implement search/filter by release type or description text

### Phase 4: Share Feature & Polishing
**Status**: ⬜ Not Started
**Objective**: Implement Twitter/X share intent, finalize responsive design, and perform final audits.
**Tasks**:
- [ ] Add interactive selection state to cards
- [ ] Implement "Tweet about it" button to build and open Twitter Web Intent URL
- [ ] Polish hover effects, loading states, and scrollbar styles
- [ ] Final verification against success criteria
