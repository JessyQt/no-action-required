# Web Accessibility Analyzer

## Overview
This project is a web application that analyzes websites for accessibility compliance with WCAG guidelines. It provides detailed feedback and recommendations for improving website accessibility.

## Features
- **URL Analysis**: Users can input any website URL for accessibility analysis
- **Accessibility Score**: Displays a numerical score (0-100) representing the website's overall accessibility
- **Detailed Issue Reports**: Lists all detected accessibility issues with:
  - Severity level (critical, serious, moderate, minor)
  - Impact description
  - Specific recommendations for fixes
  - Affected HTML elements
  - WCAG criterion references

## Technical Stack
- Frontend:
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  - Tanstack Query for data fetching
  - React Circular Progressbar for score visualization

- Backend:
  - Supabase for database and serverless functions
  - Edge Functions for accessibility analysis
  - axe-core for accessibility testing

## Core Components
1. **URLInput**: Handles website URL submission and validation
2. **AccessibilityScore**: Displays the accessibility score with a circular progress bar
3. **IssuesList**: Renders detailed accessibility issues with severity indicators

## Database Schema
### Tables
1. `accessibility_scans`:
   - Stores scan results with score and timestamps
   - Fields: id, url, score, created_at, completed_at

2. `accessibility_issues`:
   - Stores detailed accessibility issues found
   - Fields: id, scan_id, severity, message, impact, recommendation, html_element, wcag_criterion

## Edge Function
The `analyze-accessibility` function:
1. Receives a URL and scan ID
2. Uses Puppeteer to load the target website
3. Runs axe-core accessibility tests
4. Calculates an overall accessibility score
5. Stores results in Supabase database

## How It Works
1. User enters a website URL
2. System creates a new scan record
3. Edge function analyzes the website using axe-core
4. Results are stored in database
5. UI updates in real-time to show:
   - Overall accessibility score
   - Detailed list of issues
   - Recommendations for improvements

## Future Enhancements
- PDF report generation
- Historical scan comparisons
- Detailed WCAG compliance breakdown
- Custom accessibility rule configurations

## Technical Notes
- Uses real-time database subscriptions for live updates
- Implements CORS handling for cross-origin requests
- Includes error handling and loading states
- Responsive design for all screen sizes