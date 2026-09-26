# Wall Street Warriors · Team Command

Team site for the 2026–27 Wharton Global High School Investment Competition. Plain HTML, CSS and JavaScript. No build step, no server, no libraries.

## Pages

| File | What it is |
|---|---|
| `index.html` | Dashboard: countdowns, season progress, what's coming up, this week's checklist |
| `calendar.html` | Month grids Sep–Dec 2026 and Apr 2027, every deadline in ET and CT, .ics export |
| `case.html` | The case study pattern, past clients, required-return calculator, IPS builder |
| `rules.html` | Trading rules, team rules, deliverables, AI policy, disqualifiers, the Sep 15 verify list |
| `playbook.html` | How teams advance, judge quotes, deliverable plan, weekly rhythm, trade note builder |
| `dozen.html` | Coach P's Nasdaq Dozen scored on ten tech names; data in `assets/dozen.js` |
| `team.html` | Roster, roles, advisor, where we work, first meeting agenda |
| `news.html` | Announcements, competition news, reading list, champions archive, official links |

## Updating it

Everything the site shows lives in **`assets/data.js`**. Edit that file, not the pages.

- **Sep 15:** when the case study drops, fill in the starting cash and the client details, and correct any rule marked `status: "last"` (last season) to `"official"` once the 2026–27 rules confirm it.
- **Roster changes:** edit `team.members` (`status: "confirmed"` or `"maybe"`).
- **Announcements:** add to `announcements` (newest first).
- **Dates:** each event in `events` carries an Eastern Time offset (`-04:00` through Oct 31, `-05:00` from Nov 1, 2026). Internal deadlines are `kind: "internal"`.

Checkboxes, role picks, the IPS draft and trade-note drafts save in each person's own browser (localStorage). The shared versions live in the team doc.

## Phones

Everything under 700px wide gets the phone layout: a bottom tab bar (Home, Calendar, Case, Rules, More), a compact header, stacked cards instead of tables, a month-grid-plus-agenda calendar, and bottom sheets. The phone rules live in the `@media (max-width:700px)` blocks: the shared layer at the bottom of `assets/site.css`, and page-specific rules in each page's `<style>`. Desktop never sees them.

To check a page at a true 390px phone width (headless Chrome can't size a window that narrow, so the page renders inside a 390px iframe):

```
bash dev/mobile-check.sh index.html              # probe + screenshots in dev/out/
bash dev/mobile-check.sh calendar.html e=roster  # with a hash, e.g. an open event sheet
bash dev/mobile-check.sh rules.html tab=deliverables
```

The probe fails on horizontal overflow or form fields under 16px (iOS zooms them) and warns on tap targets under 36px or text under 10px. Every page should end `RESULT OK overflow=0 zoom=0 tap<36=0 tiny<10=0`.

### Keeping phone pages short

Phone pages open at 4 screens or less (most at 3), following NN/g, Baymard and GOV.UK guidance: status first, secondary sections folded, long lists cut short.

- `<section class="card" data-fold="closed">` (or `"open"`): on phones the card collapses to its header with a caret; the whole header row toggles; open/closed lasts for the browser session. Put a count in the header's `.meta` ("Competition news · 9"). A link to anything inside a folded card opens it.
- `data-m-limit="6"` on a list: on phones only the first N items show, then "Show all N". It never hides a single item.
- Calendar has an Agenda / Month switch on phones; Rules shows its six tabs as stacked sections on phones.
- Check length with `dev/section-probe.js` (see the section probe command in the build notes) and desktop with `dev/geo-probe.js` + `node dev/geo-compare.js old.json new.json`. Run the desktop comparison with `--force-prefers-reduced-motion` so load animations don't show up as movement.

## Hosting

Static files; any host works. Open `index.html` directly to preview.
