/* Wall Street Warriors — season data.
   Everything the site shows comes from here. Update this file when Wharton
   releases the 2026–27 materials (Sep 15) and as the roster changes.
   Dates carry an Eastern Time offset: -04:00 through Oct 31, -05:00 from Nov 1, 2026. */

window.WSW = window.WSW || {};
WSW.data = {
  checkedOn: "2026-09-14",

  team: {
    name: "Wall Street Warriors",
    school: "Liberty Christian School",
    city: "Argyle, Texas",
    competition: "Wharton Global High School Investment Competition",
    season: "2026–27",
    advisor: { name: "Coach P", fullName: "Edward Padalecki" },
    leader: "michael",
    min: 4, max: 6,
    chat: "Google Chat space · Wharton Global Investment Challenge",
    members: [
      { id: "michael",  name: "Michael",  status: "confirmed", note: "Team leader. Finished Wharton's Essentials of Finance this summer; wrote the team's 13-page reference." },
      { id: "caleb",    name: "Caleb",    status: "confirmed", note: "" },
      { id: "dylan",    name: "Dylan",    status: "confirmed", note: "" },
      { id: "joe",      name: "Joe",      status: "confirmed", note: "The math lead." },
      { id: "federico", name: "Federico", status: "maybe",     note: "Not asked yet. Needs a yes or no this week." }
    ],
    simulator: { name: "Wharton Investment Simulator (WInS)", url: "https://app.stocktrak.com/login?clientname=Wharton", account: "WallStreetWarriors-10447873", note: "One shared login for the whole team. Wharton says not to create separate student accounts." },
    portal: { name: "SurveyMonkey Apply", url: "https://wghsinvcomp.smapply.us/", note: "The case study, trading requirements and every submission live here. The team leader gets the invitation Sep 15." },
    safeSenders: ["wghs-invcomp@wharton.upenn.edu", "help-desk@stocktrak.com"]
  },

  roles: [
    { id: "lead",    title: "Team leader + strategy", owns: "The thesis, the IPS draft, every submission in SurveyMonkey Apply, and Wharton's emails.", fixed: "michael" },
    { id: "analyst", title: "Analysis",               owns: "Required-return math, correlations, diversification and risk numbers in a shared sheet.", suggest: "joe" },
    { id: "client",  title: "Client lead",            owns: "Knows the case cold. Asks \"does this fit the client?\" on every pick and drafts the client section of the IPS." },
    { id: "trader",  title: "Trader + journal",       owns: "Places only team-approved trades in WInS and logs the reasoning for every one. Owns the Trading Notes Analysis draft." },
    { id: "writer",  title: "Writer + editor",        owns: "One voice across Trading Notes, the IPS and the final report. Citations and the works-cited list." }
  ],

  phases: [
    { id: "pre",      label: "Pre-season",            start: "2026-09-14", end: "2026-09-14", color: "#B9C3D6", desc: "Registered. Waiting on the Sep 15 release." },
    { id: "practice", label: "Practice",              start: "2026-09-15", end: "2026-09-25", color: "#2D5395", desc: "Practice trading on WInS. Everything here is wiped Sep 25 at 4:00 p.m. ET." },
    { id: "reset",    label: "Reset",                 start: "2026-09-26", end: "2026-09-27", color: "#B9C3D6", desc: "Practice portfolios removed. Thesis and journal ready before Monday." },
    { id: "trading",  label: "Competition trading",   start: "2026-09-28", end: "2026-11-06", color: "#D98B2B", desc: "Six weeks of real trading. Roster locked at 4–6. Trading Notes due Oct 23, IPS due Nov 6." },
    { id: "report",   label: "Final report",          start: "2026-11-07", end: "2026-12-04", color: "#4B5872", desc: "Trading is over. Four weeks to write and polish the comprehensive final report." },
    { id: "judging",  label: "Judging",               start: "2026-12-05", end: "2027-04-30", color: "#B9C3D6", desc: "Wharton reads every IPS and final report. Top 50 announced (last season: late January)." }
  ],

  /* kind: release | practice | trading | deliverable | event | internal | tbd
     official: true when the date is on Wharton's pages; internal = a deadline the team sets for itself. */
  events: [
    { id: "reg-open",   date: "2026-08-10T09:00:00-04:00", kind: "event",       title: "Registration opened", detail: "Advisors could register teams from Aug 10.", official: true },
    { id: "reg-close",  date: "2026-09-11T17:00:00-04:00", kind: "event",       title: "Registration closed; team accounts due", detail: "Coach P registered Wall Street Warriors and created the shared WInS account before the deadline.", official: true },
    { id: "release",    date: "2026-09-15T09:30:00-04:00", kind: "release",     title: "Case study and materials released; practice opens", detail: "The team leader receives the SurveyMonkey Apply invitation. The client case study, trading requirements and deliverable instructions are posted there. Practice trading on WInS opens at 9:30 a.m. ET.", official: true, action: "Michael: find the invite (check spam), opt in to Wharton communications, download everything, post it in the team chat." },
    { id: "meeting",    date: "2026-09-18T16:00:00-05:00", kind: "internal",    title: "Team meeting: the case, roles, practice plan", detail: "Time is a placeholder until it's set in the chat. Agenda: read the case together, assign roles, decide what to test in practice.", official: false, tentative: true },
    { id: "practice-end", date: "2026-09-25T16:00:00-04:00", kind: "practice", title: "Practice ends; portfolios removed", detail: "All practice portfolios are deleted at 4:00 p.m. ET. Nothing carries over to the competition.", official: true, action: "Roster decision: are we 4 or 5? Thesis written. Trade journal set up." },
    { id: "trading",    date: "2026-09-28T09:30:00-04:00", kind: "trading",     title: "Competition trading begins", detail: "The real portfolio opens. From this day the team must stay at 4–6 members and the team leader can't be changed.", official: true },
    { id: "roster-int", date: "2026-10-02T17:00:00-04:00", kind: "internal",    title: "Internal: roster final", detail: "Every name, email and grade collected one week before Wharton's deadline.", official: false },
    { id: "roster",     date: "2026-10-09T17:00:00-04:00", kind: "deliverable", title: "Official team roster due", detail: "Submitted in SurveyMonkey Apply. After it's in, nobody can be added; removals need a written request from the advisor and Wharton's approval.", official: true, deliverable: "roster" },
    { id: "notes-int",  date: "2026-10-16T17:00:00-04:00", kind: "internal",    title: "Internal: Trading Notes draft", detail: "Full draft in the shared doc, one week early.", official: false },
    { id: "notes",      date: "2026-10-23T17:00:00-04:00", kind: "deliverable", title: "Trading Notes Analysis due", detail: "New this season. Wharton reviews the reasoning behind the team's trades, so the journal has to be kept from trade one.", official: true, deliverable: "notes" },
    { id: "ips-int",    date: "2026-10-30T17:00:00-04:00", kind: "internal",    title: "Internal: IPS draft", detail: "Complete Investment Policy Statement draft for Coach P to read (he can give feedback, not write it).", official: false },
    { id: "ips",        date: "2026-11-06T17:00:00-05:00", kind: "deliverable", title: "Investment Policy Statement due; trading ends", detail: "Wharton's competition portal lists both on Nov 6. The IPS defines the client's objectives, risk tolerance and the overall strategy.", official: true, deliverable: "ips" },
    { id: "report-int", date: "2026-11-27T17:00:00-05:00", kind: "internal",    title: "Internal: final report draft", detail: "Complete draft with every section, one week early. Thanksgiving is Nov 26, so this is really due before break.", official: false },
    { id: "report",     date: "2026-12-04T17:00:00-05:00", kind: "deliverable", title: "Final report and school documentation due", detail: "Semifinalists are chosen from the IPS and this report. \"School documentation\" is defined in the Sep 15 materials.", official: true, deliverable: "report" },
    { id: "first-trade", tbd: true, window: "Early October", kind: "tbd",        title: "First-trade deadline", detail: "Last season teams had to execute at least one trade by Oct 10. This season's date is in the Sep 15 trading requirements.", official: false, lastSeason: "Oct 10, 2025" },
    { id: "top50",      tbd: true, window: "Winter (last season Jan 27)", kind: "tbd", title: "Top 50 semifinalists announced", detail: "Semifinalists must submit a signed consent and waiver (parent signature if under 18) and a letter on school letterhead.", official: false },
    { id: "semis",      tbd: true, window: "Late winter (last season: week of Mar 9)", kind: "tbd", title: "Virtual semifinals", detail: "A short presentation by video conference. Every team member must take part.", official: false },
    { id: "finale",     date: "2027-04-29T09:00:00-04:00", end: "2027-04-30T17:00:00-04:00", kind: "event", title: "Learning Day and Global Finale, Philadelphia", detail: "Top 10 teams present live or by video at the Wharton School. Travel and lodging are the team's own cost.", official: true }
  ],

  deliverables: [
    { id: "roster", name: "Official Team Roster", due: "2026-10-09T17:00:00-04:00", what: "The final list of 4–6 members, submitted by the team leader in SurveyMonkey Apply.", why: "Locks the team. No additions after this.", build: ["Full name, school email and grade for every member", "Federico's answer", "Advisor confirmation from Coach P"], tips: "Submit it early in the week. A Friday 5:00 p.m. ET deadline is 4:00 p.m. our time, during school." },
    { id: "notes",  name: "Trading Notes Analysis", due: "2026-10-23T17:00:00-04:00", what: "Wharton's description: submit required trading notes and justification. In WInS, a trading note is attached to each trade (Transaction History → Add/View Notes). Past reports carried numbered trading notes: the trade, the thesis, which client goal it served, the risk, and what happened.", why: "This is where judges see whether trades follow the strategy or chase returns.", build: ["A note entered in WInS on every trade, the same day", "One journal entry per trade: date, ticker, size, thesis, client goal, risk, exit plan", "The analysis: what the trades say about the strategy so far, and the top holdings"], tips: "The Sep 15 materials define the exact format. The old mid-season review was 1–2 pages, double-spaced, on strategy, decision process and top holdings; expect something similar." },
    { id: "ips",    name: "Investment Policy Statement", due: "2026-11-06T17:00:00-05:00", what: "Wharton's description: define your client's investment objectives, risk tolerance, and overall investment strategy.", why: "Half of what the top 50 is chosen on.", build: ["Client profile from the case", "Return objective, with the required-return math", "Risk tolerance: ability and willingness, separately", "Time horizon per goal, liquidity and payout schedule", "Taxes, legal and unique circumstances", "Target allocation and how the portfolio is monitored"], tips: "Write it in the client's language. A judge should be able to hand it to the client." },
    { id: "report", name: "Comprehensive Final Report", due: "2026-12-04T17:00:00-05:00", what: "Wharton's description: present and justify your team's investment strategy, portfolio recommendations, and analysis.", why: "The other half. Past prescribed sections: title page, portfolio breakdown graphic, elevator pitch, what makes the strategy unique, advisor reflection, trading notes, WInS portfolio vs. recommended portfolio, analysis by holding or sector, conclusion, works cited.", build: ["Elevator pitch: the strategy in one paragraph", "Portfolio-level analysis: diversification, correlations, downside scenario", "Every holding tied to a client goal", "The story of how the team worked", "Works cited, including any AI-generated material"], tips: "Past format: 7–11 pages, double-spaced, 12-point Times New Roman, 1-inch margins, PDF under 5 MB, and a page count outside the range was disqualifying. Re-check on Sep 15. Write it in chunks all season; teams that start in late November don't finish." }
  ],

  tradingRules: [
    { rule: "Rankings",             value: "\"Your team's standings on WInS have little to do with the final outcome.\" Winners are chosen on the written deliverables.", status: "official", season: "2026–27" },
    { rule: "Practice period",      value: "Sep 15–25, 2026 (4:00 p.m. ET). All practice portfolios are removed.", status: "official", season: "2026–27" },
    { rule: "Competition window",   value: "Sep 28 – Dec 4, 2026. The portal lists trading ending Nov 6 with the IPS.", status: "official", season: "2026–27" },
    { rule: "Required activity",    value: "Teams \"must meet the required trading activity and portfolio management guidelines throughout the competition.\" Details come Sep 15.", status: "verify", season: "2026–27" },
    { rule: "Trading notes",        value: "A note explaining each trade is added inside WInS (Transaction History → Add/View Notes). The Oct 23 deliverable is the written analysis of them.", status: "official", season: "current" },
    { rule: "Style of strategy",    value: "Wharton's trading page: this is \"not a trading competition\"; the majority of the strategy should be a long-term, buy-and-hold approach.", status: "official", season: "current" },
    { rule: "International stocks", value: "Domestic and international equities allowed; currency converts automatically. International fills can be delayed 15–30 minutes.", status: "official", season: "current" },
    { rule: "Trading hours",        value: "9:30 a.m. – 4:00 p.m. ET on weekdays. After-hours U.S. orders fill at the next open.", status: "official", season: "current" },
    { rule: "Starting cash",        value: "$500,000 last season (up from $100,000 every year since 2012). The $300,000 on our dashboard is the practice portfolio.", status: "last", season: "2025–26" },
    { rule: "What we can buy",      value: "Any stock priced $5 or more on any exchange; ETFs from Wharton's approved list (at least one required); Treasuries from the approved list (optional).", status: "last", season: "2025–26" },
    { rule: "Trade cap",            value: "200 trades. Each buy or sell counts as one. Matches the 0 / 200 on our dashboard.", status: "last", season: "2025–26" },
    { rule: "Commissions",          value: "$25 per stock trade, $10 per Treasury trade, charged when the trade clears.", status: "last", season: "2025–26" },
    { rule: "Volume limit",         value: "Orders capped relative to the stock's daily volume (last season's rules said twice daily volume).", status: "last", season: "2025–26" },
    { rule: "Short selling, margin", value: "Not allowed.", status: "last", season: "2023–24" },
    { rule: "First trade",          value: "At least one executed trade by early October (Oct 10 last season).", status: "last", season: "2025–26" },
    { rule: "Position limit",       value: "StockTrak's default caps one position at 25% of the portfolio. Whether Wharton uses it is on the Rules tab.", status: "verify", season: "unknown" }
  ],

  verifyChecklist: [
    "Which contest is selected in WInS: practice or the 2026–27 competition? Starting cash in each?",
    "Minimum share price ($5 last season) and whether it applies to foreign listings in local currency",
    "Approved ETF list and approved Treasury list for 2026–27; is at least one ETF still required?",
    "Short selling, margin, options, futures, mutual funds, crypto: on or off",
    "Position limit percentage, volume limit, and whether practice trades count toward the 200-trade cap",
    "Commission per stock, ETF and Treasury trade",
    "First-trade deadline and any minimum number of holdings or sectors",
    "Trading Notes format: is a rationale entered in WInS with each trade, or written separately?",
    "What \"school documentation\" due Dec 4 means",
    "Whether every member needs their own SurveyMonkey Apply login for the roster"
  ],

  teamRules: [
    { rule: "Team size", value: "4 to 6 members \"from the very start of the competition.\" Falling below 4 or above 6 at any time is disqualification." },
    { rule: "Roster changes", value: "Members can be added or removed until the official roster is submitted (Oct 9). After that, no additions; removals need a written advisor request and Wharton's approval." },
    { rule: "Team leader", value: "At least 16 on Sep 28 (Michael turned 16 on Sep 10). Primary contact, submits every deliverable, must opt in to Wharton communications. Can't be changed after Sep 28." },
    { rule: "Advisor", value: "Coach P guides. Advisors \"may not make decisions on behalf of students or actively participate\" in trading or strategy. An advisor may oversee at most five teams." },
    { rule: "Same school", value: "Every member attends Liberty Christian. No student on more than one team." },
    { rule: "Outside help", value: "No paid advisors, consultants or agents, and no non-Wharton course that claims to teach the competition. An unpaid parent or professional may act as a secondary advisor." },
    { rule: "The client", value: "Never contact the case study client." },
    { rule: "Semifinalists", value: "Signed consent and waiver of liability (parent signature under 18) plus a letter on school letterhead confirming permission and enrollment." }
  ],

  aiPolicy: {
    allowed: "Generative AI tools (such as ChatGPT) may be used for brainstorming and idea generation.",
    required: "Any AI-generated material included in a report must be properly cited, like any other reference source.",
    banned: "Submitting AI-generated work as your own. Plagiarism, including using another's words or ideas as your own, is grounds for dismissal.",
    ours: "We use AI to check math, pressure-test ideas and find sources. Every sentence in the IPS and final report is written by a team member."
  },

  disqualifiers: [
    "Falling below 4 or going above 6 members at any point after Sep 28",
    "Adding a member after the official roster is submitted",
    "Missing a deliverable deadline (the team becomes ineligible for the semifinals)",
    "Paid advisors, education consultants, or a non-Wharton course that claims to teach the competition",
    "A member from another school, or a student on two teams",
    "Plagiarism, including AI-written work passed off as the team's own",
    "The advisor making decisions or doing the work for the team",
    "Contacting the case study client",
    "Changing the team leader after Sep 28, or the advisor, without Wharton's approval",
    "An offensive team name, or negative behavior including on social media"
  ],

  pastCases: [
    { season: "2025–26", client: "Connor Barwin", who: "Former NFL linebacker (WG'23), founder of the Make the World Better foundation, Philadelphia", cash: 500000, scenario: "Grow $500,000 to at least $1.5 million by 2036 while paying community grants starting at the end of year three (2029), to fund modernized courts, regraded fields, lighting and seating at community parks. Values: community-first, locally rooted, sustainability-minded.", twist: "The first case built around a foundation, and the first at $500K. The pot has to roughly triple while paying money out.", goals: [{ label: "Grow to $1.5M", year: 2036 }, { label: "Grants begin", year: 2029 }], source: "case copy; client confirmed by Wharton" },
    { season: "2024–25", client: "Ladi Ayoola", who: "32, works at Visa in Atlanta, married and planning a family", cash: 100000, scenario: "$100,000 for a three-phase housing and community hub in Lugbe, Abuja, Nigeria: at least five modest-income housing units at $10,000 each by 2030, then a $50,000 storefront and youth training center by 2040 plus a year of operating costs.", twist: "Two dated goals ten years apart, and a client who wants to focus on family and work for the next five years.", goals: [{ label: "Five housing units", year: 2030 }, { label: "Training center", year: 2040 }], source: "official case page" },
    { season: "2023–24", client: "Hilary Ash", who: "32, former BCG consultant working on the LA 2028 Olympics; played volleyball at Penn", cash: 100000, scenario: "Renovate a family property in South America within 5 years and start a women-owned sports consulting firm within 15 years.", twist: "Currency risk on the property. One finalist team hedged it with Latin American energy stocks.", goals: [{ label: "Property renovation", year: 2028 }, { label: "Consulting firm", year: 2038 }], source: "secondary sources" },
    { season: "2022–23", client: "Peter Wang Hjemdahl", who: "25, co-founder of rePurpose Global", cash: 100000, scenario: "$20,000 (20%) must earn at least $10,000 in five years to fund startup grants; a yoga and wellness center in Miami in 15 years. Cares about ocean sustainability.", twist: "A hard 8.4% a year on one bucket, and a values screen that had to be real, not decoration.", goals: [{ label: "$20K → $30K", year: 2027 }, { label: "Wellness center", year: 2037 }], source: "official case page" },
    { season: "2021–22", client: "Nichole Jordan", who: "SVP at Via, San Francisco (WG'08)", cash: 100000, scenario: "Fund a $5,000-a-year scholarship starting in 2022 for at least ten years, and build generational wealth for six nieces and nephews.", twist: "An annual payout from day one. Growing-annuity math decides whether the plan works.", goals: [{ label: "Scholarship begins", year: 2022 }, { label: "Ten years of payouts", year: 2032 }], source: "official case page" },
    { season: "2020–21", client: "Florian Hagenbuch", who: "Co-CEO of Loft, São Paulo", cash: 100000, scenario: "At least $10,000 profit in ten weeks toward a Palmeiras football club buy-in, with at least 20% in companies matching his values; 10% short-term, 90% long-term.", twist: "A ten-week profit target inside a long-term plan.", goals: [{ label: "$10K profit", year: 2020 }, { label: "Long-term 90%", year: 2030 }], source: "official case page" },
    { season: "2019–20", client: "Reshma Sohoni", who: "Co-founder of Seedcamp, London; two sons", cash: 100000, scenario: "Keep 20% liquid for her husband's safari business; invest the rest for the family.", twist: "A liquidity constraint that shaped the whole allocation.", goals: [{ label: "20% liquid", year: 2020 }], source: "official case page" }
  ],

  casePattern: [
    { t: "A real Wharton alum as the client", d: "The person is real; the money scenario is written for the competition." },
    { t: "A dated medium-term goal in dollars", d: "Usually three to five years out. It sets the required return." },
    { t: "A long goal ten to fifteen years out", d: "This is where the growth bucket lives." },
    { t: "An impact or values angle", d: "Every case since 2020–21: a foundation, community housing, sustainability." },
    { t: "A tension to resolve", d: "Growing the money while paying some of it out, or a liquidity lock on part of it." },
    { t: "No contacting the client", d: "Stated in the rules and in the cases themselves." }
  ],

  quotes: [
    { q: "Success is not determined by portfolio performance. Teams are evaluated on the quality of their investment strategy, how well it aligns with their client's objectives, the strength of their research and analysis, and their ability to clearly communicate and defend their recommendations.", who: "Wharton Global Youth Program, competition page", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/" },
    { q: "The one thing that stood out to me was the ability to connect the client's objectives to an investment strategy.", who: "Joshua Tam, 2024 semifinal judge", url: "https://globalyouth.wharton.upenn.edu/news/wharton-global-youth-hosts-five-virtual-events-to-announce-the-2024-investment-competition-finalists/" },
    { q: "Less is more, and having an explainable strategy.", who: "DMV's Finest, Thomas Jefferson High School, 2023 champions", url: "https://globalyouth.wharton.upenn.edu/news/wharton-investment-competition-tales-from-the-2023-teams/" },
    { q: "Efficient frontier, cross correlations, diversification or portfolio theory… That differentiated better performances.", who: "Vikas Keswani, 2024 Global Finale judge", url: "https://globalyouth.wharton.upenn.edu/news/spark-investments-bergen-county-academies-new-jersey-bring-the-heat-to-the-2024-investment-competition-global-finale/" },
    { q: "The best solutions are made up of simple, elegant ideas.", who: "Melissa Ko Hahn, 2025 judge", url: "https://globalyouth.wharton.upenn.edu/news/lets-go-announcing-the-top-10-teams-advancing-to-the-wharton-investment-competitions-2025-global-finale/" },
    { q: "The part I enjoyed the most was hearing about how you assessed each member's skills and learned to work together as a team.", who: "Jeanette Ourada, 2024 judge", url: "https://globalyouth.wharton.upenn.edu/news/wharton-global-youth-hosts-five-virtual-events-to-announce-the-2024-investment-competition-finalists/" },
    { q: "Cut slides, cut words, cut minutes… they said five things and I remembered them all.", who: "Andrea Vittorelli, J.P. Morgan, 2022 judge", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/archive/" },
    { q: "Hiding behind fancy terms and formulas. I would encourage you to fight against that.", who: "Melissa Ko Hahn, 2025 semifinal judge", url: "https://globalyouth.wharton.upenn.edu/news/lets-go-announcing-the-top-10-teams-advancing-to-the-wharton-investment-competitions-2025-global-finale/" }
  ],

  insights: [
    { n: 1, t: "Returns don't pick the winners", d: "The top 50 are chosen from the IPS and final report. WInS rankings are a learning tool, not the scoreboard." },
    { n: 2, t: "Tie every holding to the client", d: "A judge should be able to trace each position to a stated client goal. If a pick doesn't serve one, it doesn't belong." },
    { n: 3, t: "Keep the strategy explainable", d: "Champions cut their plan down until every member could pitch it in a minute." },
    { n: 4, t: "Analyze the whole portfolio, not just picks", d: "Correlations, diversification, a downside scenario. Judges named this as what separated stronger teams." },
    { n: 5, t: "Write the thesis before trading", d: "\"It is easier to develop a strategy first and buy stocks second.\" Then don't churn." },
    { n: 6, t: "Tell the story", d: "How the team split the work and what it learned counts. Keep a competition journal from week one." },
    { n: 7, t: "Impact claims need data", d: "Recent clients are impact-minded, but generic ESG language is common and judges know it. Show the numbers behind a values screen." },
    { n: 8, t: "Finishing is the first filter", d: "About a third of registered teams turn in a final report. Every deliverable on time puts us ahead of most of the field." }
  ],

  numbers: { season: "2025–26", registered: 6300, reports: 2300, semifinalists: 50, finalists: 11 },

  reportStructure: [
    { s: "Elevator pitch", d: "The strategy in one paragraph a client would understand." },
    { s: "What makes it unique", d: "The idea other teams won't have, and why it fits this client." },
    { s: "Advisor reflection", d: "What Coach P observed about how the team worked." },
    { s: "Trading notes", d: "Numbered notes: trade, thesis, client goal, risk, outcome." },
    { s: "WInS portfolio vs. recommended portfolio", d: "What we actually held versus what we'd recommend the client hold long-term, and why they differ." },
    { s: "Analysis by holding or sector", d: "Valuation, beta, role in the portfolio, downside." },
    { s: "Works cited", d: "Every source, including any AI-generated material." }
  ],

  weekly: [
    { d: "Monday", t: "Sector pitches", s: "Each member brings one idea from their sector, tied to a client goal. Ten minutes each." },
    { d: "Tuesday", t: "Analysis", s: "Joe runs the numbers on anything the team liked: valuation, beta, correlation with what we hold." },
    { d: "Wednesday", t: "Vote and trade", s: "The team votes. The trader places approved trades and writes the journal entry the same day." },
    { d: "Friday", t: "Write", s: "One hour on the current deliverable. Internal deadlines are one week before Wharton's." }
  ],

  announcements: [
    { date: "2026-09-14", text: "Practice trading and the client case study arrive tomorrow, Sep 15. Michael will post the case in the chat once the SurveyMonkey Apply invite lands." },
    { date: "2026-09-13", text: "Roster for the season: Michael, Caleb, Dylan, Joe, and maybe Federico. Cash can't do it." },
    { date: "2026-09-04", text: "Registered as Wall Street Warriors. Coach P created the shared WInS team account; the $300,000 showing is the practice portfolio." }
  ],

  /* Wharton Global Youth news and posts worth reading; newest first. No posts were published Jul–Sep 2026;
     all 2026–27 information lives on the competition pages. */
  news: [
    { date: "2026-04-30", kind: "competition", title: "Stuyvesant High School wins the 2026 Global Finale", summary: "FigCapital (Stuyvesant HS, New York) took the title at the Apr 25–26 finale; HHA Investments (Brasília) second, Riverhawk Traders (Farmington, CT) third.", url: "https://globalyouth.wharton.upenn.edu/news/2026-investment-competition-global-champions/" },
    { date: "2026-03-20", kind: "competition", title: "11 teams advance to the 2026 Global Finale", summary: "Semifinal results: 11 finalists named for the April finale in Philadelphia.", url: "https://globalyouth.wharton.upenn.edu/news/11-teams-advance-to-the-2026-wharton-global-high-school-investment-competition-global-finale/" },
    { date: "2026-01-27", kind: "competition", title: "A winning season: thousands of teams, bigger stakes, and the Top 50 revealed", summary: "6,300+ registered teams, 2,300 final reports from 79 countries, $500K virtual cash (up from $100K); the 50 semifinalists listed.", url: "https://globalyouth.wharton.upenn.edu/news/a-winning-season-thousands-of-teams-bigger-stakes-and-the-top-50-2026-investment-competition-teams-revealed/" },
    { date: "2025-05-05", kind: "competition", title: "Learning Day is all light and TastyKakes for this year's competitors", summary: "What the Friday before the finale looks like: campus tours, faculty sessions and networking for the finalist teams.", url: "https://globalyouth.wharton.upenn.edu/news/learning-day-is-all-light-and-tastykakes-for-this-years-investment-competitors/" },
    { date: "2025-05-01", kind: "competition", title: "BAM Investing, Deerfield Academy, wins the 2025 competition", summary: "BAM Investing won the Apr 26, 2025 finale for client Ladi Ayoola; Finance from France (Lycée Français de Chicago) second, FA Quakers third.", url: "https://globalyouth.wharton.upenn.edu/news/bam-investing-from-deerfield-academy-massachusetts-wins-the-2025-wharton-global-high-school-investment-competition/" },
    { date: "2025-03-24", kind: "competition", title: "The top 10 teams advancing to the 2025 Global Finale", summary: "Ten finalists chosen from 5,000 registered teams after the semifinal round; judges praised simple, elegant ideas.", url: "https://globalyouth.wharton.upenn.edu/news/lets-go-announcing-the-top-10-teams-advancing-to-the-wharton-investment-competitions-2025-global-finale/" },
    { date: "2025-01-30", kind: "competition", title: "The 50 semifinalists in the 2025 competition", summary: "1,800+ teams from 66 countries submitted final reports; 50 semifinalists announced.", url: "https://globalyouth.wharton.upenn.edu/news/announcing-the-semifinalists-in-the-2025-wharton-global-high-school-investment-competition/" },
    { date: "2024-04-23", kind: "competition", title: "Spark Investments, Bergen County Academies, wins the 2024 Global Finale", summary: "Spark Investments won for client Hilary Ash; judges singled out portfolio theory and diversification analysis as what separated top teams.", url: "https://globalyouth.wharton.upenn.edu/news/spark-investments-bergen-county-academies-new-jersey-bring-the-heat-to-the-2024-investment-competition-global-finale/" },
    { date: "2024-04-16", kind: "article", title: "Podcast: the competition sparks a passion for finance", summary: "A 2023 third-place finalist from Prague on splitting sectors across the team and pairing fundamentals with macro.", url: "https://globalyouth.wharton.upenn.edu/articles/future-of-the-business-world-podcast/the-wharton-investment-competition-sparks-a-passion-for-finance/" },
    { date: "2023-10-24", kind: "educator", title: "TikTok stocks: debunking investing myths", summary: "Classroom activities for countering social-media investing myths with data and long-term analysis.", url: "https://globalyouth.wharton.upenn.edu/essential-educator-blog/tiktok-stocks-help-debunk-investing-myths-for-your-students/" },
    { date: "2023-06-06", kind: "competition", title: "Tales from the 2023 teams", summary: "The 2023 champions on why less is more and an explainable strategy wins; write the strategy first, buy stocks second.", url: "https://globalyouth.wharton.upenn.edu/news/wharton-investment-competition-tales-from-the-2023-teams/" },
    { date: "2022-04-05", kind: "educator", title: "Win or lose, student competitors should learn to tell their stories", summary: "Keep a competition journal from week one; the process is part of what judges want to hear.", url: "https://globalyouth.wharton.upenn.edu/essential-educator-blog/win-or-lose-student-competitors-should-learn-to-tell-their-stories/" },
    { date: "2021-09-08", kind: "educator", title: "10 tips for teaching the Wharton Investment Competition", summary: "The best single read: know the client, quiz the team on the case, don't rush the first trade, chunk the final report.", url: "https://globalyouth.wharton.upenn.edu/essential-educator-blog/the-essential-educator-10-tips-for-teaching-the-wharton-investment-competition/" },
    { date: "2021-09-08", kind: "article", title: "How the next generation can add value to ESG investing", summary: "Why an ESG thesis needs data behind it; a Wharton professor calls most ESG offerings greenwash.", url: "https://globalyouth.wharton.upenn.edu/articles/environment/how-the-next-generation-can-add-value-to-esg-investing/" }
  ],

  champions: [
    { season: "2025–26", year: 2026, champion: "FigCapital", school: "Stuyvesant High School, New York, NY", runnerUp: "HHA Investments (Colégio Marista de Brasília, Brazil)", client: "Connor Barwin", url: "https://globalyouth.wharton.upenn.edu/news/2026-investment-competition-global-champions/" },
    { season: "2024–25", year: 2025, champion: "BAM Investing", school: "Deerfield Academy, Deerfield, MA", runnerUp: "Finance from France (Lycée Français de Chicago, IL)", client: "Ladi Ayoola", url: "https://globalyouth.wharton.upenn.edu/news/bam-investing-from-deerfield-academy-massachusetts-wins-the-2025-wharton-global-high-school-investment-competition/" },
    { season: "2023–24", year: 2024, champion: "Spark Investments", school: "Bergen County Academies, Hackensack, NJ", runnerUp: "Wreckers Wealth Management (Staples High School, Westport, CT)", client: "Hilary Ash", url: "https://globalyouth.wharton.upenn.edu/news/spark-investments-bergen-county-academies-new-jersey-bring-the-heat-to-the-2024-investment-competition-global-finale/" },
    { season: "2022–23", year: 2023, champion: "DMV's Finest", school: "Thomas Jefferson HS for Science and Technology, Alexandria, VA", runnerUp: "Amity 7 Chakras Investments (Amity Regional High School, Woodbridge, CT)", client: "Peter Wang Hjemdahl", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/archive/" },
    { season: "2021–22", year: 2022, champion: "Sailing to Success", school: "Schools in Arizona", runnerUp: "Sky Investments (Bergen County Academies, Hackensack, NJ)", client: "Nichole Jordan", url: "https://globalyouth.wharton.upenn.edu/news/top-teams-sail-to-success-in-the-2022-wharton-investment-competition-global-finale/" },
    { season: "2020–21", year: 2021, champion: "M&R Investments", school: "Marvin Ridge High School, Waxhaw, NC", runnerUp: "Wells Street Capital (Walter Payton College Prep, Chicago, IL)", client: "Florian Hagenbuch", url: "https://globalyouth.wharton.upenn.edu/news/mr-investments-first-place-2021-investment-competition/" },
    { season: "2019–20", year: 2020, champion: "East Capital K and Over the Moon Investments (tie)", school: "UWC South East Asia, Singapore; Maclay School, Tallahassee, FL", runnerUp: "Eagles Value Added (Graded American School of São Paulo, Brazil)", client: "Reshma Sohoni", url: "https://globalyouth.wharton.upenn.edu/news/2020-investment-competition-global-finale-ends-tie-first-place/" },
    { season: "2018–19", year: 2019, champion: "Filter Coffee Investments", school: "Amity International School, Noida, India", runnerUp: "Scion Capital (Jayshree Periwal International School, Jaipur, India)", client: "Sachin Rekhi", url: "https://globalyouth.wharton.upenn.edu/news/2019-investment-competition-global-finale-showcases-financial-literacy-finest/" },
    { season: "2017–18", year: 2018, champion: "All You Can Eat Buffett", school: "Thomas Jefferson HS for Science and Technology, Alexandria, VA", runnerUp: "The Alchemy of Investments (Amity International School, Noida, India)", client: "Jack Abraham", url: "https://globalyouth.wharton.upenn.edu/news/student-investors-compete-and-win/" },
    { season: "2016–17", year: 2017, champion: "Silver Stone Partners", school: "The International School Bangalore, India", runnerUp: "One Up on Herd Street (Amity International School, Noida, India)", client: null, url: "https://globalyouth.wharton.upenn.edu/news/silver-stone-partners-india-takes-home-gold/" },
    { season: "2014–15", year: 2015, champion: "Western Trade", school: "West Ranch High School, Stevenson Ranch, CA", runnerUp: "The Titans of Dalal Street (Narsee Monjee School of Commerce and Economics, Mumbai, India)", client: null, url: "https://globalyouth.wharton.upenn.edu/news/the-results-are-in-western-trade-wrangles-top-honors/" },
    { season: "2013–14", year: 2014, champion: "HTHS Investment Club", school: "High Technology High School, Lincroft, NJ", runnerUp: "The Stockers (Northwest High School, Germantown, MD)", client: "Jack Abraham", url: "https://globalyouth.wharton.upenn.edu/news/2014-investment-competition-finale-goes-global/", confidence: "likely" },
    { season: "2012–13", year: 2013, champion: "Centsational (Philadelphia) and Superiority Investment (National)", school: "William W. Bodine HS, Philadelphia, PA; Montgomery Blair HS, Silver Spring, MD", runnerUp: null, client: null, url: "https://globalyouth.wharton.upenn.edu/news/kwhs-aberdeen-announce-winners-2012-2013-investment-competition/" }
  ],

  resources: [
    { group: "Competition", title: "Competition home", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/", note: "2026–27 key dates and links to every subpage" },
    { group: "Competition", title: "FAQ", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/faq/", note: "Team size, practice window, deliverables, contact emails" },
    { group: "Competition", title: "General rules and roles", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/rules-roles/", note: "Eligibility, advisor duties, conduct, AI rule, prizes" },
    { group: "Competition", title: "Deliverables", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/deliverables/", note: "The four required deliverables and their dates" },
    { group: "Competition", title: "Trading guidance", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/trading/", note: "International trading, hours, and the buy-and-hold guidance" },
    { group: "Competition", title: "Archive: past champions and clients", url: "https://globalyouth.wharton.upenn.edu/competitions/investment-competition/archive/", note: "Recent seasons with links to each announcement" },
    { group: "Competition", title: "Sample case study (2022–23)", url: "https://globalyouth.wharton.upenn.edu/investment-competition/previous-winners/case-study-for-2022-2023/", note: "A full past case, to study the format before ours drops" },
    { group: "Competition", title: "Sample case study (2024–25)", url: "https://globalyouth.wharton.upenn.edu/investment-competition/previous-winners/case-study-for-2024-2025/", note: "Ladi Ayoola: the three-phase housing and community hub" },
    { group: "Competition", title: "SurveyMonkey Apply portal", url: "https://wghsinvcomp.smapply.us/", note: "Case study, updates, and every deliverable submission" },
    { group: "Competition", title: "AI policy", url: "https://globalyouth.wharton.upenn.edu/ai-policy/", note: "No AI-generated work as your own; cite any AI material" },
    { group: "Simulator", title: "WInS login", url: "https://app.stocktrak.com/login?clientname=Wharton", note: "Wharton Investment Simulator sign-in (shared team login)" },
    { group: "Simulator", title: "StockTrak Wharton hub", url: "https://edu.stocktrak.com/wharton/", note: "Help, login and support for WInS" },
    { group: "Simulator", title: "Portfolio FAQ", url: "https://edu.stocktrak.com/wharton/portfolio-faq/", note: "Trades, trading notes, order types. Its cash figure is stale." },
    { group: "Simulator", title: "Tutorial videos", url: "https://edu.stocktrak.com/wharton/tutorial-videos/", note: "Managing the portfolio and placing a trade" },
    { group: "Simulator", title: "WInS user guide (2024 PDF)", url: "https://edu.stocktrak.com/wharton/wp-content/uploads/sites/19/2024/09/2024-WInS-User-Guide.pdf", note: "3.4 MB. Check SurveyMonkey Apply for a 2026 edition." },
    { group: "Learn", title: "Video glossary", url: "https://globalyouth.wharton.upenn.edu/glossary/", note: "Hundreds of finance terms explained by Wharton faculty" },
    { group: "Learn", title: "Resources for educators", url: "https://globalyouth.wharton.upenn.edu/resources-for-educators/", note: "Lesson plans and the Essential Educator blog" },
    { group: "Learn", title: "Meet the Experts (archived webinars)", url: "https://globalyouth.wharton.upenn.edu/meet-the-experts-2020-2021/", note: "Asset-management talks from 2020–21; nothing newer found" },
    { group: "Contact", title: "wghs-invcomp@wharton.upenn.edu", url: "mailto:wghs-invcomp@wharton.upenn.edu", note: "The competition organizers" },
    { group: "Contact", title: "help-desk@stocktrak.com", url: "mailto:help-desk@stocktrak.com", note: "WInS technical support" },
    { group: "Contact", title: "Competition contact form", url: "https://globalyouth.wharton.upenn.edu/investment-competition-contact-us/", note: "Web form for questions to Wharton" }
  ]
};
