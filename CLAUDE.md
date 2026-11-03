# Workshop house rules

- We are business people, not programmers. Explain what you're doing in plain English.
- These are real companies. Never invent an event or show sample alerts about them.
  Every warning needs a real source link and date. For test data, use only
  Cataloochee Cell Works.
- Never write our API key into any file. This repository is public.
- Everything must work with a double-click on index.html and also at our live link.
- When we say "save to GitHub", commit and push with a short note.
  When we say "get the latest", pull first.

## How our dashboard fits together

Our team builds ONE dashboard together. Each person owns one section of it.

- index.html is the dashboard: the page frame, the layout and an empty box for each
  section. Only the dashboard owner edits it.
- Each section lives in its own file in the sections folder, such as
  sections/weather.js. Only that section's owner edits it.
- A section file draws its content into the box on index.html with the same name.
  For example, sections/weather.js fills <div id="weather">. index.html loads every
  section with a line like <script src="sections/weather.js"></script>.
- If a section's box isn't on index.html yet, the section should still load
  without errors; it simply shows up once the dashboard owner adds the box.
- Our purchasing data is in data/laurel-ridge-data.js, available as
  window.LAUREL_RIDGE. index.html loads it before any section. Use it instead of
  reading the CSV files, so everything works with a double-click.
- Keep each section's styles inside its own file, with names that start with the
  section's name, so sections don't change each other's look.

## Our team's plan

One dashboard, three sections. For this test, one person owns index.html and
all three sections.

- **suppliers** (`sections/suppliers.js` -> `<div id="suppliers">`): lists
  every supplier in data/suppliers.csv, each with a risk level (e.g. Low,
  Medium, High) and a one-line reason for that level.
- **weather** (`sections/weather.js` -> `<div id="weather">`): today's
  conditions and any severe weather alerts for each supplier's factory city.
- **alerts** (`sections/alerts.js` -> `<div id="alerts">`): checks each
  supplier's website for customer-facing advisories or notices. When
  something serious appears, shows a ready-to-send email to the purchasing
  team saying what happened and what to do. Every warning shown must have a
  real source link and date; the only supplier we invent sample/test alerts
  for is Cataloochee Cell Works.
