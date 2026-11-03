# Stretch goals

Finished the core challenge? Pick any of these, in any order. Each makes a good page for one teammate to build in `pieces/` while someone else keeps improving the main dashboard.

## One star

- **Show your confidence.** Next to each warning, show the source, its date, and how sure the tool is.
- **Map it.** Plot every supplier on a map, colored by risk. How many of our eggs sit in one basket?

## Two stars

- **Find alternatives.** For any supplier your tool flags, research 2 or 3 real alternative suppliers. Show where they are, what they make, and the trade-offs of switching.
- **Stock-up advisor.** Use `data/bom.csv`, `data/parts.csv` and `data/inventory.csv` to find the parts that have only one source, take longest to replace, and would stop the most bikes. Recommend which to stock up on, and by how many weeks.
- **What-if.** Let the user "shut down" any supplier for a number of weeks. Show which bikes stop, when we run out of stock, and how much revenue is at risk.
- **Add a warning sign.** Watch a kind of signal you didn't start with. Ask another team what they chose.

## Three stars

- **Watch on its own.** Type `/loop 10m` followed by instructions, and Claude will re-check your sources every 10 minutes, update the dashboard, save to GitHub and raise the alert when something new appears. Each check costs a little of your budget, so press Esc to stop it before you leave.
- **Real email alert.** Have Claude write a Google Apps Script that checks your sources every few minutes and emails your team from your workshop Gmail when something serious appears. You'll paste it into script.google.com.
- **Red-team it.** Have Claude write a misleading or ambiguous test warning about Cataloochee Cell Works, then check whether your tool overreacts or misses it. Use a test copy, never your live sources.
