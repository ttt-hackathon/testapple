# Team TestApple: Supplier Early Warning for Laurel Ridge Bikeworks

**Your live link:** https://ttt-hackathon.github.io/testapple/

## The situation

You work in purchasing at **Laurel Ridge Bikeworks**, an electric-bike maker in Hendersonville, NC. We build three models, about 120 bikes a week, from parts made by 13 suppliers in eight countries.

When a supplier has a problem, such as a storm, a fire, a strike or a backed-up port, we usually find out when a shipment doesn't arrive. By then the production line is days from stopping.

*Laurel Ridge Bikeworks is fictional. The suppliers are real companies at their real locations, but every relationship, price, order and inventory number in this folder is made up.*

## Your challenge

**Build an early-warning tool that spots supply chain trouble before it reaches our production line, and raises an alert when it does.**

Your team decides:

- which warning signs matter for these suppliers
- which sources give the earliest reliable warning
- what counts as serious enough for an alert, and what the alert tells purchasing to do
- what the tool looks like

## A finished tool

1. Covers every supplier in `data/suppliers.csv`.
2. Watches at least two kinds of real, current warning signs, each shown with its source link and date.
3. Gives each supplier a risk level and says why.
4. Has an alert: a rule for what counts as serious, plus a ready-to-send email to the purchasing team saying what happened and what to do.
5. Works at your team's live link.

Finished early? Open `stretch-goals.md`.

## What's in this folder

| File | What it is |
| --- | --- |
| `CLAUDE.md` | Workshop house rules that Claude reads every time it starts. Add your team's plan at the bottom. |
| `data/` | Our purchasing records: suppliers, parts, products, inventory and open orders. `data/README.md` explains each file. |
| `index.html` | Your team's main page. Whatever is here appears at your live link. |
| `pieces/` | Each teammate's own page goes here. |
| `stretch-goals.md` | Extra challenges for teams that finish. |

## How your team works today

- **One person owns `index.html`.** Everyone else builds their own page in `pieces/`, so nobody overwrites anyone else's work.
- **Two phrases cover all the GitHub you need.** Say *"get the latest from GitHub"* before starting something new, and *"save my work to GitHub with a short note"* whenever something works.
- **Your team shares a $25 Claude budget.** Type `/usage` to see what your session has cost.
- **Keep it fictional.** Don't add real data from your own company. This repository is public.

## Timeline

| Time | What happens |
| --- | --- |
| 1:30 | **Research.** Each person asks their own Claude what could disrupt these suppliers and where the early warning signs show up. Compare notes and decide what to build and who builds which piece. Have Claude add your plan to `CLAUDE.md` and save it to GitHub. |
| 1:45 | **Build.** Save to GitHub whenever something works. |
| 2:45 | **Combine and test.** Everyone gets the latest; the `index.html` owner links every piece from the main page. |
| 3:10 | **Final save.** Everyone opens the live link. |
| 3:20 | **Get ready to share.** Each person writes 3 lines: what we built, one prompt that worked, one surprise. |
