# Nora - FoodFinder

Chrome extension that highlights free food events on CampusGroups. Works on any university's CampusGroups subdomain.

## How It Works

Nora runs automatically when you visit a CampusGroups events page. It uses two detection methods:

1. **Tag-based detection** — Checks event tags for "Free Food!" labels (high accuracy)
2. **Keyword matching** — Scans event text for food-related phrases like "free lunch", "catered", "food provided" (fallback)

Matching events get a colored left border and a "Free Food" badge:
- **Green** = high confidence (definitely free food)
- **Orange** = medium confidence (likely free food)

## Install

1. Clone or download this repo
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select this folder
5. Navigate to any CampusGroups events page

## Usage

- Visit any CampusGroups site (e.g. `heinz.campusgroups.com/events`)
- Free food events are highlighted automatically
- Click the Nora icon in the toolbar to toggle on/off or see the event count

## Supported Sites

Works on any `*.campusgroups.com` subdomain — CMU, NYU, Duke, etc.

## Tech

- Vanilla JavaScript, no dependencies, no build step
- Chrome Extension Manifest V3
- Fully client-side — no backend, no API keys

## Roadmap

- [ ] Daily auto-scan with summary report
- [ ] Registration deadline tracking
- [ ] Day-before reminder notifications
- [ ] Optional AI-powered detection (user-provided API key or local Ollama)

## License

MIT
