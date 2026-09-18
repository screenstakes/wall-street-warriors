/* Wall Street Warriors — season data.
   Everything the site shows comes from here. The Sep 15 materials are partly in: the client case
   and the Competition Guide. Four portal pages are still missing: Deliverables, FAQs, WInS, Trading.
   Dates carry an Eastern Time offset: -04:00 through Oct 31, -05:00 from Nov 1, 2026. */

window.WSW = window.WSW || {};
WSW.data = {
  checkedOn: "2026-09-16",

  /* Warren, the site's helper: the relay that holds the Claude key (see agentic-os/warren-relay). */
  /* Two hostnames, one relay. School filters block *.sslip.io (it reads as dynamic DNS), so the
     .com is tried first; the widget remembers whichever one works on that machine. */
  warren: {
    endpoints: ["https://warren.sidelineorder.com", "https://warren.192-241-138-219.sslip.io"],
    name: "Warren"
  },

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
      { id: "federico", name: "Federico", status: "confirmed", note: "Joined Sep 14. The fifth member." }
    ],
    simulator: { name: "Wharton Investment Simulator (WInS)", url: "https://app.stocktrak.com/login?clientname=Wharton", account: "WallStreetWarriors-10447873", note: "One shared login for the whole team. Wharton says not to create separate student accounts." },
    portal: { name: "SurveyMonkey Apply", url: "https://wghsinvcomp.smapply.us/", note: "Every submission goes here, and the six Pages hold all the materials: Competition Guide, Client, Deliverables, FAQs, WInS and Trading. Michael is in as team leader." },
    safeSenders: ["wghs-invcomp@wharton.upenn.edu", "help-desk@stocktrak.com"]
  },

  /* ---- 2026–27 client. From the official case study PDF, released Sep 15 2026 via SurveyMonkey Apply. ---- */
  client: {
    season: "2026–27",
    name: "Laura Gao",
    title: "Storyteller, Entrepreneur, and Creative Visionary",
    who: "Wharton 2018, Statistics & Information Decisions Management. Born in Wuhan, raised in Texas. Bestselling graphic novelist and illustrator — The Wuhan I Know (2020) and the memoir Messy Roots — after starting out as a product manager in tech. Author, illustrator, educator and public speaker.",
    quote: "The only person who needs to believe in something is yourself.",
    yearZero: 2026,
    yearNote: "Year N = calendar year − 2026. So 2027 is Year 1, 2028 is Year 2, 2031 is Year 5, 2033 is Year 7. All contributions and withdrawals happen at the beginning of the year.",
    contributions: [
      { year: 2027, amount: 300000, note: "Initial investment with the firm." },
      { year: 2028, amount: 150000, note: "From publishing advances, speaking, licensing and other ventures." }
    ],
    totalContributed: 450000,
    flowNote: "Living expenses are covered outside the portfolio. Apart from those two contributions she neither adds to nor withdraws from the portfolio before 2033.",
    project: { name: "The Creative Residency", where: "Taiwan", year: 2033, what: "A small, community-oriented space where artists, writers, designers, entrepreneurs and educators can temporarily live, work, teach and collaborate." },
    goals: [
      { label: "Operating commitment begins", year: 2033, hard: true },
      { label: "Final operating payment", year: 2042, hard: true },
      { label: "Co-sponsor conversations begin", year: 2031, hard: false }
    ],
    obligations: [
      {
        id: "operating",
        name: "Operating commitment",
        mandatory: true,
        what: "Ten annual payments of $50,000, one at the beginning of each year from 2033 through 2042.",
        detail: "Each payment is a fixed $50,000 and is NOT adjusted for inflation. All ten must be funded by the portfolio with a high degree of certainty — teams may not rely on co-sponsors, grants, program fees or any outside funding. Funding beyond the 2042 payment is out of scope.",
        asks: ["Recommend the size of the operating reserve", "Recommend its initial asset composition", "Explain how that composition should change, if at all, as payments approach", "Define what counts as a high degree of funding certainty", "Explain how that certainty was evaluated, and the assumptions behind it"]
      },
      {
        id: "facility",
        name: "Facility contribution",
        mandatory: false,
        what: "After the reserve is set aside in 2033, how much of the remainder can she responsibly put toward building the residency?",
        detail: "There is no predetermined amount. She knows committing everything left would limit her flexibility as the project develops. Any remaining facility cost can come from co-sponsors, grants, collaborators or program fees.",
        asks: ["Recommend and justify the contribution", "Preserve appropriate financial flexibility", "Show how favorable and unfavorable markets change the answer"]
      },
      {
        id: "cosponsor",
        name: "Co-sponsor range",
        mandatory: true,
        what: "In 2031, two years early, she must tell potential co-sponsors a credible dollar RANGE for her 2033 contribution — not one exact number.",
        detail: "Promising more than she can deliver would damage her credibility and cost her co-sponsors. The range must also protect the portfolio's ability to fund all ten operating payments.",
        asks: ["Recommend the dollar range", "State how confident the team is that 2033 lands inside it", "Explain how favorable and unfavorable markets affect it", "Draft part of her fundraising materials describing the contribution"]
      }
    ],
    /* Computed from the case. Annuity-due: first payment lands the moment the reserve is struck. */
    math: {
      reserveFormula: "Reserve = 50,000 × [(1 − (1+r)^−10) ÷ r] × (1 + r)",
      portfolioFormula: "V(2033) = 300,000 × (1+r)^6 + 150,000 × (1+r)^5",
      reserve: [
        { rate: 0.00, cost: 500000, label: "cash, no return" },
        { rate: 0.03, cost: 439305, label: "3% ladder" },
        { rate: 0.04, cost: 421767, label: "4% ladder" },
        { rate: 0.05, cost: 405391, label: "5% ladder" }
      ],
      projections: [
        { r: 0.05, v2033: 593471, facility: 171704 },
        { r: 0.06, v2033: 626290, facility: 204523 },
        { r: 0.07, v2033: 660602, facility: 238835 },
        { r: 0.08, v2033: 696462, facility: 274695 },
        { r: 0.09, v2033: 733924, facility: 312157 }
      ],
      facilityBasis: "facility = V(2033) − $421,767, the reserve defeased with a 4% ladder",
      breakeven: [
        { label: "Reserve held in cash ($500,000)", r: 0.0188 },
        { label: "Reserve laddered at 4% ($421,767)", r: -0.0114 }
      ],
      takeaways: [
        { h: "The hurdle is certainty, not return", d: "Funding all ten payments needs 1.88% a year if the reserve sits in cash, and a negative return if it is laddered. Every past case had a demanding growth target. This one does not \u2014 so the question is how much risk we can afford, not how much return we need." },
        { h: "The reserve eats most of the pot", d: "57\u201371% of the 2033 portfolio across 5\u20139% returns. The facility contribution is whatever is left, a residual rather than a target." },
        { h: "Nominal payments want a nominal ladder, not TIPS", d: "The payments are fixed in dollars, so a plain Treasury ladder matches them exactly. TIPS would add basis risk instead of removing it \u2014 the reflex answer is the wrong one." },
        { h: "Laddering frees $78,233 without taking market risk", d: "The reserve costs $500,000 in cash and $421,767 laddered at 4%. The difference goes straight to the facility, earned by structure rather than by picking stocks." },
        { h: "De-risk by 2031, not 2033", d: "She has to quote co-sponsors a credible range two years early. A portfolio still at 12% volatility in 2031 can only honestly promise roughly $54K\u2013$423K, which is useless to a co-sponsor. Most teams will glide to 2033 and miss this." }
      ]
    },
    outOfScope: ["Total cost of the facility, a construction budget, the project's funding gap, or a business plan for the residency", "Size or composition of a separate contingency fund or endowment", "Personal income taxes and capital gains taxes", "Legal and regulatory requirements of establishing a residency in Taiwan"],
    winsNote: "The WInS portfolio does not set Laura's 2027 starting value and its gains or losses are never added to or subtracted from her projections. Projections start from the $300,000 in 2027 plus $150,000 in 2028 with return assumptions consistent with the strategy. WInS is evidence of decision-making, nothing more.",
    narrative: [
      {
            "h": "The assignment",
            "p": [
                  "You are a team of young analysts working at an asset management company.",
                  "Your portfolio manager (your team's teacher/advisor who makes the final investment decisions for your firm's portfolio) recently met with a potential client, Laura Gao, a bestselling author, illustrator, entrepreneur, and educator, who is planning the next chapter of her career. Laura has built a successful creative business by turning ideas into opportunities, and she is now seeking thoughtful financial planning to help her achieve her long-term goals.",
                  "Your team hopes to develop the investment strategy that Laura ultimately chooses as she works toward achieving her future vision."
            ]
      },
      {
            "h": "Introducing Laura Gao",
            "p": [
                  "Laura Gao believes stories have the power to change how people see the world.",
                  "Born in Wuhan, China, and raised in Texas, Laura is a bestselling graphic novelist, illustrator, entrepreneur, and educator whose work explores identity, belonging, and the power of storytelling. While studying at the Wharton School, she combined her passion for creativity with an entrepreneurial mindset and launched a small business. She graduated in 2018 with a degree in Statistics & Information Decisions Management before beginning her career as a product manager in the technology industry.",
                  "In 2020, Laura published The Wuhan I Know, a comic inspired by her personal experiences during the COVID-19 pandemic. Originally intended as a response to misinformation and anti-Asian racism, the comic resonated with readers worldwide and ultimately inspired her bestselling graphic memoir, Messy Roots. Today, her books are read in classrooms around the world and have sparked conversations about identity, belonging, and community.",
                  "Although Laura's career began in business and technology, she has always approached creativity with an entrepreneurial mindset. As an author, illustrator, educator, and public speaker, she has combined artistic passion with strategic thinking and a willingness to pursue unconventional opportunities.",
                  "That philosophy continues to guide Laura as she considers what comes next."
            ]
      },
      {
            "h": "Looking ahead",
            "p": [
                  "Laura has no shortage of ideas for the future. As she considers the next chapter of her career, she recognizes that achieving ambitious goals requires more than creativity alone. Thoughtful financial planning and long-term investing will play an important role in turning those ideas into reality. Working with your portfolio manager, Laura has identified several long-term financial objectives that reflect both her entrepreneurial mindset and her passion for innovation."
            ]
      },
      {
            "h": "Laura's financial goals",
            "p": [
                  "At the beginning of 2027, Laura plans to invest $300,000 with an asset management firm. She will contribute an additional $150,000 at the beginning of 2028, using earnings from publishing advances, speaking engagements, licensing, and other entrepreneurial ventures.",
                  "For purposes of the competition, teams should use the following timeline. Year 0 is 2026, the present, before any money has been invested. 2026 is Year 0, 2027 is Year 1, 2028 is Year 2, 2031 is Year 5, 2033 is Year 7. Any year not listed follows the same pattern: subtract 2026 from the calendar year to get its year number.",
                  "All contributions and withdrawals occur at the beginning of the applicable year. The ten operating payments are therefore spaced exactly one year apart.",
                  "Laura's living expenses and short-term financial needs will be covered by income and financial resources outside the portfolio. Apart from the two contributions described above, she will neither add to nor withdraw from the portfolio before 2033. The portfolio should therefore be managed to support the goals described below.",
                  "Laura understands that investing involves uncertainty and periods of market volatility. Although she has been willing to take thoughtful risks throughout her entrepreneurial career, she wants her investment team to recommend an appropriate balance between pursuing growth and protecting the capital required for her goals."
            ]
      },
      {
            "h": "The Creative Residency",
            "p": [
                  "In 2033, Laura plans to establish a collaborative creative residency in Taiwan. She envisions a small, community-oriented space where artists, writers, designers, entrepreneurs, and educators can temporarily live, work, teach, and collaborate.",
                  "Establishing the residency will require funding for the facility as well as reliable support for its early operations. The investment portfolio must fund the operating commitment described below and may also cover part of the facility's cost. Any remaining facility cost, and any operating support beyond Laura's commitment, may come from co-sponsors, grants, collaborators, program fees, continued business income, or other sources."
            ]
      },
      {
            "h": "Operating commitment",
            "p": [
                  "Laura will make ten annual payments of $50,000 toward the residency's operating expenses, one at the beginning of each year from 2033 through 2042. For purposes of the competition, each payment is a fixed $50,000 and is not adjusted for inflation.",
                  "All ten payments must be funded by the investment portfolio with a high degree of certainty. Teams may not rely on co-sponsors, grants, program fees, or other outside funding to meet this requirement. Funding the residency beyond the final payment in 2042 is outside the scope of the competition.",
                  "At the beginning of 2033, before making the first operating payment or contributing to the facility, Laura will set aside a portion of the portfolio to fund the ten payments. This set-aside is called the operating reserve. Teams must recommend its size and initial asset composition and explain how its composition should change, if at all, as the annual payments approach and are made. They should also define what they consider a high degree of funding certainty, explain how they evaluated that level of certainty, and identify the assumptions supporting their recommendation."
            ]
      },
      {
            "h": "Facility contribution",
            "p": [
                  "After establishing the operating reserve in 2033, Laura must decide how much of the remaining portfolio she can responsibly contribute toward the cost of establishing the residency facility. She recognizes that committing all remaining assets could limit her financial flexibility as the project develops.",
                  "There is no predetermined facility contribution. Teams must recommend and justify the extent to which Laura can responsibly contribute, based on their investment strategy, projected portfolio outcomes, assumptions, and understanding of her goals. Teams are not expected to determine the size or investment composition of a separate contingency fund or endowment."
            ]
      },
      {
            "h": "Communicating with co-sponsors",
            "p": [
                  "Laura plans to begin approaching potential co-sponsors in 2031, two years before the residency is established. At that time, she will need to describe how much she expects to contribute toward the facility in 2033. A meaningful personal contribution may signal that the residency is financially viable, demonstrate Laura's commitment to the project, and make potential co-sponsors more willing to contribute. In 2031, however, the value of her portfolio in 2033 remains uncertain.",
                  "If Laura promises more than she can ultimately contribute, she could damage her credibility and lose the confidence or participation of co-sponsors. Rather than promising one exact amount, she wants to communicate a credible range for her potential contribution.",
                  "Teams must recommend the dollar range Laura should communicate and state how confident they are that her 2033 contribution will fall within that range. They should explain how favorable and unfavorable market outcomes could affect the amount she can provide. The proposed range must also protect the portfolio's ability to fund the ten-year operating commitment.",
                  "Each team must also draft part of Laura's fundraising materials describing this potential contribution for prospective co-sponsors."
            ]
      },
      {
            "h": "Developing Laura's investment strategy",
            "p": [
                  "There is no single correct strategy for achieving Laura's goals. Teams may reach different conclusions about risk, asset allocation, liquidity, return expectations, funding confidence, the facility contribution, and the financial flexibility Laura should preserve.",
                  "The WInS portfolio represents each team's implementation of its investment strategy during the competition. It does not determine Laura's actual portfolio value at the beginning of 2027. For long-term projections, teams should begin with Laura's $300,000 investment in 2027, add the $150,000 contribution in 2028, and use reasonable return assumptions consistent with their strategy. Gains or losses generated during the WInS trading period should not be added to or subtracted from Laura's portfolio projections.",
                  "Teams should identify and explain their assumptions about investment performance, the timing of cash flows, outside funding, the effect of inflation on portfolio projections and facility costs, and the financial flexibility Laura should preserve. They should also consider how favorable and unfavorable investment outcomes would affect their recommendations.",
                  "Evaluators will consider the three deliverables together. Teams should use each deliverable for its intended purpose while maintaining a clear and consistent investment strategy across all three. Detailed Final Report requirements will be released at the beginning of Week 7.",
                  "The total cost of the facility has not been determined. Teams are not expected to estimate that cost, prepare a construction budget, determine the project's total funding gap, or develop a detailed business plan for the residency. Their primary focus should remain on the investment strategy and how much the portfolio can responsibly provide toward Laura's goals.",
                  "For purposes of the competition, teams do not need to account for personal income taxes, capital gains taxes, or the legal and regulatory requirements of establishing a residency in Taiwan."
            ]
      },
      {
            "h": "What the strategy must do",
            "list": [
                  "Support the ten-year operating commitment with a high degree of certainty.",
                  "Determine a responsible facility contribution for the residency.",
                  "Address how investment uncertainty could affect both the operating commitment and the facility contribution.",
                  "Communicate Laura's potential facility contribution to co-sponsors clearly and credibly.",
                  "Preserve appropriate financial flexibility when determining the facility contribution."
            ]
      }
    ],
    timeline: [{"cal": "2026", "yr": 0, "what": "Right now. Nothing is invested yet. The whole competition (Sep 28 - Dec 4) happens inside Year 0.", "now": true}, {"cal": "2027", "yr": 1, "what": "She invests $300,000."}, {"cal": "2028", "yr": 2, "what": "She adds $150,000. Nothing else moves until 2033."}, {"cal": "2029-2030", "yr": "3-4", "what": "Untouched, compounding."}, {"cal": "2031", "yr": 5, "what": "She starts approaching co-sponsors and must quote a credible range for her 2033 contribution.", "key": true}, {"cal": "2032", "yr": 6, "what": "Untouched."}, {"cal": "2033", "yr": 7, "what": "Operating reserve is struck, the residency is established, and payment 1 of 10 is made.", "key": true}, {"cal": "2034-2041", "yr": "8-15", "what": "Payments 2 through 9."}, {"cal": "2042", "yr": 16, "what": "Payment 10. The commitment ends; anything past this is out of scope."}],
    timelineNote: "The year numbers locate events - they do not give you growth periods. Money invested at the start of Year 1 and measured at the start of Year 7 compounds for SIX years, not seven. That is why the exponent is 6 on the $300,000 and 5 on the $150,000. Because the competition sits entirely in Year 0, Laura's money never actually moves while we are trading - which is exactly why WInS gains and losses are never added to her projections.",
    source: "2026_WGY_Gao Case Study-FINAL.pdf and 2026_WGY_Competition Guide-FINAL.pdf, SurveyMonkey Apply → Pages → Client",
    released: "2026-09-15"
  },

  /* ---- Competition Guide, released Sep 15 2026 via SurveyMonkey Apply. ---- */
  guide: {
      "source": "2026_WGY_Competition Guide-FINAL.pdf, SurveyMonkey Apply -> Pages -> Competition Guide",
      "released": "2026-09-15",
      "intro": "The competition challenges the team to develop, implement and evaluate a long-term investment strategy that helps a client meet specific financial goals and future cash-flow needs. Over ten weeks we get to know the client, research and analyze, develop a strategy, build a portfolio and evaluate our approach. The first six weeks are for developing and implementing the strategy in WInS. At the end of Week 6 the IPS goes in, trading ends and the portfolio freezes.",
      "bigPicture": "Your investment strategy is the cornerstone of the competition. This is not a competition to see which team can make the most money in a few weeks. From the beginning, develop a strategy and use it to guide research, portfolio construction and every investment decision. The strategy may evolve as we learn more, but the decisions have to reflect a clear and cohesive approach.",
      "notEvaluatedOn": [
          "Your portfolio ranking",
          "How many trades you make",
          "Whether you outperform other teams",
          "Whether your portfolio makes money during the competition"
      ],
      "notEvalNote": "A long-term investment strategy cannot be judged solely by what happens in the market over a few weeks. Instead, the portfolio is evidence of the decisions the team made and how it put the strategy into practice.",
      "roadmap": [
          {
              "n": 1,
              "t": "Understand",
              "lead": "Get to know your client and the investment challenge.",
              "d": "Study the case study, the financial goals, the future funding commitments and the sources of uncertainty. Work out what additional research will help you understand the investment problem."
          },
          {
              "n": 2,
              "t": "Develop",
              "lead": "Build your investment strategy.",
              "d": "Use research and analysis to establish the principles that guide portfolio construction and balance growth, liquidity, funding reliability and flexibility."
          },
          {
              "n": 3,
              "t": "Implement and document",
              "lead": "Put your strategy into action.",
              "d": "Use WInS to construct a portfolio that reflects the strategy, document the reasoning behind each trade, and demonstrate decision-making through the Trading Notes Analysis."
          },
          {
              "n": 4,
              "t": "Articulate",
              "lead": "Formally present and finalize your strategy in the IPS.",
              "d": "Communicate the strategy clearly, including how it addresses risk and uncertainty, and the framework that guides investment decisions."
          },
          {
              "n": 5,
              "t": "Evaluate",
              "lead": "Assess your strategy and its implementation in the Final Report.",
              "d": "Evaluate the implementation and explain why the strategy supports the client's operating commitment, facility contribution, financial flexibility and communication with co-sponsors across varying outcomes."
          }
      ],
      "connect": [
          {
              "name": "Trading Notes Analysis",
              "purpose": "Demonstrate your decision-making",
              "shows": "How three investment decisions reflected the team's strategy and supported the client's goals, future funding needs or constraints. The strategy may keep evolving before the IPS, but the decisions should already reflect a clear strategic approach."
          },
          {
              "name": "Investment Policy Statement",
              "purpose": "Articulate your strategy",
              "shows": "Present and finalize the strategy, including how it balances growth, liquidity, funding reliability, flexibility, risk and uncertainty, and how it guides portfolio decisions."
          },
          {
              "name": "Final Report",
              "purpose": "Evaluate your strategy and implementation",
              "shows": "Evaluate implementation of the IPS strategy and present the team's analysis and recommendations for the client's operating commitment, facility contribution, financial flexibility and communication with co-sponsors across varying outcomes."
          }
      ],
      "connectNote": "The deliverables are not separate assignments. Evaluators consider all three together, so the strategy has to stay clear and consistent across them.",
      "ipsLock": [
          "Your investment strategy is final.",
          "Trading ends and your WInS portfolio is frozen.",
          "You may not change your holdings."
      ],
      "ipsLockNote": "A long-term strategy may include planned adjustments as funding dates approach, but it should not be rewritten simply because markets move or hindsight reveals a different outcome. You may identify decisions you would make differently, but you may not redesign the strategy after observing the results.",
      "lookingFor": {
          "list": [
              "Thoughtful strategy",
              "Research and analysis",
              "Client understanding",
              "Disciplined decisions",
              "Management of risk and uncertainty",
              "Communication",
              "Creativity"
          ],
          "note": "Judges want to understand not only what the team decided to do, but the reasoning, assumptions and tradeoffs behind those decisions. The work should show an understanding of the client, informed investment decisions, and clear communication of how the approach supports the client's goals while addressing risk and uncertainty."
      },
      "winsRole": "WInS is where the strategy gets put into action under real market conditions - research investments, build the portfolio, make decisions and see how changing conditions affect the holdings. It is a tool for implementing the strategy, not the competition scorecard.",
      "tradeNoteSpec": "When a trade is executed in WInS, the Trading Note should capture the reasoning behind the decision: its alignment with the strategy, the supporting research or analysis, and its expected role in growth, liquidity, risk management or future funding. Do not treat Trading Notes as an afterthought - they are the record of how the team put its strategy into practice.",
      "pagesTab": [
          {
              "page": "Client",
              "holds": "The complete Client Case Study",
              "have": true
          },
          {
              "page": "Competition Guide",
              "holds": "The ten-week arc, road map and judging standard",
              "have": true
          },
          {
              "page": "Deliverables",
              "holds": "IPS Requirements, Trading Notes Analysis Requirements, and the Evaluation Criteria",
              "have": false
          },
          {
              "page": "FAQs",
              "holds": "Competition FAQs",
              "have": false
          },
          {
              "page": "WInS",
              "holds": "Simulator setup and how-to",
              "have": false
          },
          {
              "page": "Trading",
              "holds": "This season's trading requirements - approved list, commissions, caps, starting cash",
              "have": false
          }
      ]
  },

  /* Five jobs, built around the four things Wharton actually grades (three of the four are documents),
     not around the portfolio. Everyone also owns one sector: the rules require at least one stock per
     sector per member, and past final reports had to print who managed each sector. Every job has a
     backup, because after Oct 9 nobody can be added and 4 members is the disqualification floor. */
  roles: [
    { id: "lead", title: "Team leader and submissions", fixed: "michael", backup: "client",
      owns: "Sends every deliverable to Wharton and keeps the calendar. Breaks a tie vote. Does the last read of the IPS and the report so five people's writing sounds like one team.",
      weekly: "Posts the week's three questions the night before the meeting. Chairs it. Submits a day early, never on the deadline." },
    { id: "client", title: "Laura's case", backup: "lead",
      owns: "Knows the client case cold and answers one question on every trade: does this help Laura? Writes the first draft of the IPS.",
      weekly: "Keeps the one-page client brief current. Any pitch that doesn't name one of her goals gets sent back." },
    { id: "numbers", title: "The numbers", backup: "lead",
      owns: "The math and the charts: what return we need, the bond ladder, what a position does to the whole portfolio. Only person who edits the spreadsheet.",
      weekly: "One new name analysed with a valuation. Updates the portfolio sheet before the meeting." },
    { id: "risk", title: "Risk and the bear case",  backup: "log",
      owns: "Checks every trade against our limits before the vote, and writes the short version of why it could be wrong. Never writes the bear case on their own idea.",
      weekly: "Posts a one-page risk sheet before the meeting: what we hold, anything near a limit, the worst case." },
    { id: "log", title: "Trade log and the rules", backup: "numbers",
      owns: "Logs every trade the same day, checks the log against WInS each week, and owns the Oct 23 Trading Notes Analysis. Also keeps the checklist of Wharton's rules and formats \u2014 nothing gets submitted until it passes.",
      weekly: "Same-day log entries, a 10-line set of minutes within a day, and one reconciliation against the account." }
  ],

  /* One sector each: Wharton requires at least one stock from as many sectors as there are members,
     held all season. Index funds and Treasuries are team positions \u2014 the whole team votes on those. */
  /* The team's working files: one Google Sheet each, in Michael's school Drive
     (Wall Street Warriors → Team docs), shared to the team's school emails. Paste each
     sheet's link into url; an empty url shows "Link coming" instead of a button. The order
     follows a trade: fit check, number, case against, log, then Michael's dashboard.
     guide: an optional how-to page for that job, linked next to the job name. */
  files: {
    folder: "",
    list: [
      { id: "federico", job: "Laura's case", title: "Federico — Laura's case", url: "https://docs.google.com/spreadsheets/d/14x4_n_DWi6GHIYjGW57T5murzIr24M786P7NStcjMNc/edit", role: "client",
        week: "Reply to every trade card with the goal it serves, or send it back. From week 5, draft the IPS.",
        tabs: [["This week", "Your row for the week: yellow cells, then ✓"], ["Laura", "The client on one page, and what each fact means for a trade"], ["Fit check", "One row per trade card: which of Laura's goals it serves"], ["IPS", "The 11 sections to draft Oct 24 to 30, and who feeds you each one"], ["Works cited", "Every source as we use it, including any AI"]],
        has: ["Laura, our client, on one page", "Does each trade help Laura? One row per trade", "The Investment Policy Statement (IPS), all 11 sections"] },
      { id: "joe", job: "The numbers", title: "Joe — The numbers", url: "https://docs.google.com/spreadsheets/d/15I2v_2KLHGlGB8IQs0b1Ye5XHlRpZeCA4_0Qcc_lCYw/edit", role: "numbers", guide: "numbers.html",
        week: "Update the Portfolio tab, value one idea the team liked, and add every new number to the Ledger.",
        tabs: [["This week", "Your row for the week: yellow cells, then ✓"], ["Learn 1 to 4", "Growth, the reserve, weight, DCF: a worked example, one to finish, one blank, each with a check"], ["Laura", "Her real numbers: six blanks that say Correct when they're right"], ["Portfolio", "What we hold, against the 5% / 8% / 30% limits"], ["Valuation", "A value for one stock. Copy the tab for each idea"], ["Ledger", "Every number that goes in a deliverable, with its source"]],
        has: ["Four short math lessons that check your work", "Laura's real numbers: Pile A (her reserve) and Pile B (money for the building)", "Our portfolio and a value for each stock we pitch"] },
      { id: "dylan", job: "Risk, and the case against each trade", title: "Dylan — Risk and the bear case", url: "https://docs.google.com/spreadsheets/d/1Rq2ZdyHtm8vxGg1tGDP4UxWAwcfKynmq6OuPFZvwgQ4/edit", role: "risk",
        week: "Post the case against each trade before its vote, and the week's biggest position and worst case.",
        tabs: [["This week", "Your row for the week: yellow cells, then ✓"], ["Limits", "Every holding against our limits, one stock per sector, and an ETF"], ["Bear case", "One column per trade, five questions, 150 words. Column B is a finished example"]],
        has: ["Every stock we own checked against our limits: 5% to start, 8% max, 30% per sector", "The case against each trade, posted before the vote", "A check that we hold all five sectors and an ETF"] },
      { id: "caleb", job: "Trade log and the rules", title: "Caleb — Trade log and the rules", url: "https://docs.google.com/spreadsheets/d/1I7TWOR_a8SKvLY1m6dgAIDX_BSyGaIyu4Kj7QSSqmhE/edit", role: "log",
        week: "Log every trade the day it happens, check the log against WInS on Friday, post the minutes after the meeting.",
        tabs: [["This week", "Your row for the week: yellow cells, then ✓"], ["Log", "Every trade the same day: why, the vote, and the ✓s"], ["Friday check", "The log against the WInS account"], ["Rules", "Wharton's eligibility checklist. Nothing is submitted until it says Ready"], ["Minutes", "One row per meeting: questions, decisions, who does what"], ["Oct 23", "Pick the three notes for the Trading Notes Analysis"]],
        has: ["Every trade, logged the same day", "Every Friday, the log checked against our WInS account", "The rules checklist, meeting minutes and the Oct 23 Trading Notes"] },
      { id: "michael", job: "Team leader and submissions", title: "Michael — Team leader and submissions", url: "https://docs.google.com/spreadsheets/d/1BzihhvurG8pQWLJAjdCDcQSXCoJH3joDtuycbe-moZg/edit", role: "lead",
        week: "Post the questions the night before, run the meeting, check the dashboard and the portal.",
        tabs: [["This week", "Your row for the week: yellow cells, then ✓"], ["Dashboard", "Reads the other four sheets live: weeks done, IPS progress, rules and risk flags"], ["Deliverables", "The five things due to Wharton. Status fills itself in"], ["Meeting", "One row per meeting: the questions, decisions, who does what"], ["Team grid", "Who did their week. Fills itself in"], ["Agreement", "The one-page team agreement, signed by all five"]],
        has: ["A live dashboard that reads everyone's sheet", "The four deliverables and where each one stands", "The meeting plan, team grid and team agreement"] }
    ],
    coach: { title: "Coach P — Season overview", url: "", what: "One read-only page for Coach P that fills itself in: deliverable status with days left, each person's weeks, portfolio health, and what the team needs from him." },
    flow: [
      { when: "Before a vote", what: "Someone pitches a trade. Federico checks it fits Laura, Joe works out what the stock is worth, and Dylan posts the case against it." },
      { when: "After the vote", what: "Caleb logs the trade the same day, with the reason." },
      { when: "Every Friday", what: "Caleb checks his log against WInS. Joe copies what we own into his Portfolio tab and Dylan into his Limits tab. The dashboard checks all three totals match." },
      { when: "All the time", what: "Michael's dashboard pulls from all four sheets on its own: who finished their week, how far the IPS is, and any rules or risk flags." }
    ]
  },

  sectors: [
    { id: "tech",   name: "Tech and communication", eg: "software, chips, phones, media" },
    { id: "health", name: "Health care",            eg: "drugs, devices, insurers" },
    { id: "fin",    name: "Financials",             eg: "banks, payments, insurance" },
    { id: "ind",    name: "Industrials and energy", eg: "machines, transport, oil, utilities" },
    { id: "cons",   name: "Consumer",               eg: "food, retail, restaurants, travel" }
  ],

  /* How we decide and how we meet. Scaled from real investment-club rules: a written objection with a
     deadline, and silence lets the trade go ahead, so nobody can block a trade by never answering. */
  ops: {
    decide: [
      "3 of 5 yes approves a trade. Michael breaks a tie.",
      "4 of 5 for anything over 10% of the portfolio, a new kind of investment, or a change to the plan.",
      "The bear case is posted before the vote. If it isn't posted in time the trade goes ahead \u2014 staying quiet is not a veto.",
      "Position limits until the Trading page says otherwise: 5% of the portfolio in one stock to start, 8% at most, 30% in one sector.",
      "Whoever proposes a trade writes its note the same day. No note, no trade next time.",
      "Your name stays on your section even when it's empty. Nobody quietly covers for anyone."
    ],
    meeting: {
      length: "18 minutes, standing",
      steps: [
        "Status goes in the chat before the meeting. Reading it is the price of admission.",
        "Two minutes, everyone writes their answer to today's question before anyone talks.",
        "One round where each person reads one line, no arguing yet.",
        "Eight minutes on the question, then the decision.",
        "Last three minutes: who does what, and when and where they'll do it. Posted before anyone leaves."
      ]
    },
    /* The five things the report is scored on. Wharton's wording, from the archived Judging and
       Evaluation page (2023-24) - the current rubric sits in SurveyMonkey Apply under Deliverables.
       Note #4: how we run ourselves is a scored line item, not admin. */
    criteria: [
      { n: "Investment strategy", d: "A clear, creative thesis with mid- and long-term thinking, and a portfolio in at least as many sectors as we have members." },
      { n: "Client knowledge", d: "Tailored to Laura's goals closely enough that it would win her over as a client." },
      { n: "Portfolio analysis", d: "Real understanding of the tools, with both numbers and judgement. Not jargon." },
      { n: "Our competition experience", d: "How we worked together, how we made decisions, and what we learned. This is why the jobs and the journal exist." },
      { n: "Creativity and presentation", d: "A compelling story, clean data, an authentic team voice." }
    ],

    /* Miss one of these and the report never gets read, however good it is. The trade log and rules
       owner checks them; nothing is submitted until they pass. */
    gates: [
      "First trade placed by Wharton's deadline",
      "At least one stock in every sector we have a member for, plus at least one ETF, held at the checkpoint",
      "Every deliverable in on time - skipping one has ended teams' seasons",
      "Only securities the Trading page allows",
      "Inside the page range, with every required element",
      "Same advisor and same roster after the Oct 9 lock"
    ],

    /* The season changes shape four times. Each phase has one person on point. */
    phases: [
      { id: "setup", when: "Sep 28 \u2013 Oct 9", name: "Set up and start trading", lead: "lead",
        does: ["Everyone picks a sector and names their backup", "The one-page team agreement gets signed by all five", "First trades, each with its note the same day"],
        gate: "Roster submitted Oct 6 or 7, not Oct 9." },
      { id: "notes", when: "Oct 10 \u2013 Oct 23", name: "Trading Notes Analysis", lead: "log",
        does: ["Keep trading and keep writing notes", "Pick the three notes that best show the strategy being tested", "Write the analysis from everyone's notes"],
        gate: "Submitted Oct 21. Missing this one has ended teams' seasons." },
      { id: "ips", when: "Oct 24 \u2013 Nov 6", name: "Investment Policy Statement", lead: "client",
        does: ["Laura's case owner drafts it", "Each person writes why their sector is in the plan", "The numbers owner supplies the required return and the ladder", "Michael edits it into one voice"],
        gate: "Submitted Nov 5. Trading ends Nov 6." },
      { id: "report", when: "Nov 7 \u2013 Dec 4", name: "Final report", lead: "lead",
        does: ["Nov 7: outline it together, no writing yet, every section gets an owner and a page budget", "Nov 20: all drafts done", "Nov 21: everyone reviews a section they did not write, and no new ideas after that day", "Nov 24: Michael merges it; Nov 30 one-voice pass"],
        gate: "Submitted Dec 2. Ask Coach P for the school letter by Nov 13." }
    ]
  },

  phases: [
    { id: "pre",      label: "Pre-season",            start: "2026-09-14", end: "2026-09-14", color: "#B9C3D6", desc: "Registered. Materials released Sep 15 \u2014 client is Laura Gao." },
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
    { id: "meeting",    date: "2026-09-16T09:00:00-05:00", kind: "internal",    title: "Team meeting (Wed 9:00 a.m.)", detail: "Tuesday lunch has passed, so the remaining option is Wednesday Sep 16 during zero period, around 9:00 a.m. Michael confirms in the chat. Agenda: read the case together, assign roles, decide what to test in practice.", official: false, tentative: true },
    { id: "practice-end", date: "2026-09-25T16:00:00-04:00", kind: "practice", title: "Practice ends; portfolios removed", detail: "All practice portfolios are deleted at 4:00 p.m. ET. Nothing carries over to the competition.", official: true, action: "Roster decision: are we 4 or 5? Thesis written. Trade journal set up." },
    { id: "trading",    date: "2026-09-28T09:30:00-04:00", kind: "trading",     title: "Competition trading begins", detail: "The real portfolio opens. From this day the team must stay at 4–6 members and the team leader can't be changed.", official: true },
    { id: "roster-int", date: "2026-10-02T17:00:00-04:00", kind: "internal",    title: "Internal: roster final", detail: "Every name, email and grade collected one week before Wharton's deadline.", official: false },
    { id: "roster",     date: "2026-10-09T17:00:00-04:00", kind: "deliverable", title: "Official team roster due", detail: "Submitted in SurveyMonkey Apply. After it's in, nobody can be added; removals need a written request from the advisor and Wharton's approval.", official: true, deliverable: "roster" },
    { id: "notes-int",  date: "2026-10-16T17:00:00-04:00", kind: "internal",    title: "Internal: Trading Notes draft", detail: "Full draft in the shared doc, one week early.", official: false },
    { id: "notes",      date: "2026-10-23T17:00:00-04:00", kind: "deliverable", title: "Trading Notes Analysis due", detail: "New this season. Wharton reviews the reasoning behind the team's trades, so the journal has to be kept from trade one.", official: true, deliverable: "notes" },
    { id: "ips-int",    date: "2026-10-30T17:00:00-04:00", kind: "internal",    title: "Internal: IPS draft", detail: "Complete Investment Policy Statement draft for Coach P to read (he can give feedback, not write it).", official: false },
    { id: "ips",        date: "2026-11-06T17:00:00-05:00", kind: "deliverable", title: "Investment Policy Statement due; trading ends", detail: "Wharton's competition portal lists both on Nov 6. The IPS defines the client's objectives, risk tolerance and the overall strategy.", official: true, deliverable: "ips" },
    { id: "report-int", date: "2026-11-27T17:00:00-05:00", kind: "internal",    title: "Internal: final report draft", detail: "Complete draft with every section, one week early. Thanksgiving is Nov 26, so this is really due before break.", official: false },
    { id: "report",     date: "2026-12-04T17:00:00-05:00", kind: "deliverable", title: "Final report and school documentation due", detail: "Semifinalists are chosen from the IPS and this report. \"School documentation\" is defined on the FAQs page in SurveyMonkey Apply, not pulled into this site yet.", official: true, deliverable: "report" },
    { id: "first-trade", tbd: true, window: "Early October", kind: "tbd",        title: "First-trade deadline", detail: "Last season teams had to execute at least one trade by Oct 10. This season's date is on the Trading page in SurveyMonkey Apply, not pulled into this site yet.", official: false, lastSeason: "Oct 10, 2025" },
    { id: "top50",      tbd: true, window: "Winter (last season Jan 27)", kind: "tbd", title: "Top 50 semifinalists announced", detail: "Semifinalists must submit a signed consent and waiver (parent signature if under 18) and a letter on school letterhead.", official: false },
    { id: "semis",      tbd: true, window: "Late winter (last season: week of Mar 9)", kind: "tbd", title: "Virtual semifinals", detail: "A short presentation by video conference. Every team member must take part.", official: false },
    { id: "finale",     date: "2027-04-29T09:00:00-04:00", end: "2027-04-30T17:00:00-04:00", kind: "event", title: "Learning Day and Global Finale, Philadelphia", detail: "Top 10 teams present live or by video at the Wharton School. Travel and lodging are the team's own cost.", official: true }
  ],

  deliverables: [
    { id: "roster", name: "Official Team Roster", due: "2026-10-09T17:00:00-04:00", what: "The final list of 4–6 members, submitted by the team leader in SurveyMonkey Apply.", why: "Locks the team. No additions after this.", build: ["Full name, school email and grade for all five members", "Advisor confirmation from Coach P"], tips: "Submit it early in the week. A Friday 5:00 p.m. ET deadline is 4:00 p.m. our time, during school." },
    { id: "notes",  name: "Trading Notes Analysis", due: "2026-10-23T17:00:00-04:00", what: "Official (Competition Guide): select THREE Trading Notes and reflect on how those decisions supported, tested or refined the strategy. Due at the end of Week 4, two weeks before the IPS. In WInS, a trading note is attached to each trade (Transaction History → Add/View Notes). Past reports carried numbered trading notes: the trade, the thesis, which client goal it served, the risk, and what happened.", why: "This is where judges see whether trades follow the strategy or chase returns.", build: ["A note entered in WInS on every trade, the same day", "One journal entry per trade: date, ticker, size, thesis, client goal, risk, exit plan", "The analysis: what the trades say about the strategy so far, and the top holdings"], tips: "Full requirements live in SurveyMonkey Apply under Pages \u2192 Deliverables \u2014 not yet pulled into this site. The old mid-season review was 1–2 pages, double-spaced, on strategy, decision process and top holdings; expect something similar." },
    { id: "ips",    name: "Investment Policy Statement", due: "2026-11-06T17:00:00-05:00", what: "Wharton's description: define your client's investment objectives, risk tolerance, and overall investment strategy.", why: "Half of what the top 50 is chosen on. Once the deadline passes the strategy is FINAL, trading ends and the portfolio freezes.", build: ["Client profile from the case", "Return objective, with the required-return math", "Risk tolerance: ability and willingness, separately", "Time horizon per goal, liquidity and payout schedule", "Taxes, legal and unique circumstances", "Target allocation and how the portfolio is monitored"], tips: "Write it in the client's language. A judge should be able to hand it to the client." },
    { id: "report", name: "Comprehensive Final Report", due: "2026-12-04T17:00:00-05:00", what: "Official (Competition Guide): evaluate how the IPS strategy was implemented, and present the team's analysis and recommendations for Laura's operating commitment, facility contribution, financial flexibility and communication with co-sponsors across varying outcomes.", why: "The other half. Detailed requirements are not released until the beginning of Week 7 (about Nov 9), after the IPS is already locked. Past prescribed sections: title page, portfolio breakdown graphic, elevator pitch, what makes the strategy unique, advisor reflection, trading notes, WInS portfolio vs. recommended portfolio, analysis by holding or sector, conclusion, works cited.", build: ["Elevator pitch: the strategy in one paragraph", "Portfolio-level analysis: diversification, correlations, downside scenario", "Every holding tied to a client goal", "The story of how the team worked", "Works cited, including any AI-generated material"], tips: "Past format: 7–11 pages, double-spaced, 12-point Times New Roman, 1-inch margins, PDF under 5 MB, and a page count outside the range was disqualifying. Wharton's own requirements come at the start of Week 7, about Nov 9 — after the IPS is locked. Write it in chunks all season; teams that start in late November don't finish." }
  ],

  tradingRules: [
    { rule: "Rankings",             value: "\"Your team's standings on WInS have little to do with the final outcome.\" Winners are chosen on the written deliverables.", status: "official", season: "2026–27" },
    { rule: "Practice period",      value: "Sep 15–25, 2026 (4:00 p.m. ET). All practice portfolios are removed.", status: "official", season: "2026–27" },
    { rule: "Competition window",   value: "Sep 28 – Dec 4, 2026. The portal lists trading ending Nov 6 with the IPS.", status: "official", season: "2026–27" },
    { rule: "Required activity",    value: "Teams \"must meet the required trading activity and portfolio management guidelines throughout the competition.\" The specifics live on the Trading page in SurveyMonkey Apply, which is not pulled into this site yet.", status: "verify", season: "2026–27" },
    { rule: "Trading notes",        value: "A note explaining each trade is added inside WInS (Transaction History → Add/View Notes). The Oct 23 deliverable is the written analysis of them.", status: "official", season: "current" },
    { rule: "Style of strategy",    value: "Wharton's trading page: this is \"not a trading competition\"; the majority of the strategy should be a long-term, buy-and-hold approach.", status: "official", season: "current" },
    { rule: "International stocks", value: "Domestic and international equities allowed; currency converts automatically. International fills can be delayed 15–30 minutes.", status: "official", season: "current" },
    { rule: "Trading hours",        value: "9:30 a.m. – 4:00 p.m. ET on weekdays. After-hours U.S. orders fill at the next open.", status: "official", season: "current" },
    { rule: "Starting cash",        value: "$300,000: what our WInS account starts with, and what every team sheet uses. Last season it was $500,000. If Wharton resets the account to a different amount on Sep 28, change one cell in Joe's, Caleb's and Dylan's sheets.", status: "verify", season: "2026–27" },
    { rule: "What we can buy",      value: "Any stock priced $5 or more on any exchange; ETFs from Wharton's approved list (at least one required); Treasuries from the approved list (optional).", status: "last", season: "2025–26" },
    { rule: "Trade cap",            value: "200 trades. Each buy or sell counts as one. Matches the 0 / 200 on our dashboard.", status: "last", season: "2025–26" },
    { rule: "Commissions",          value: "$25 per stock trade, $10 per Treasury trade, charged when the trade clears.", status: "last", season: "2025–26" },
    { rule: "Volume limit",         value: "Orders capped relative to the stock's daily volume (last season's rules said twice daily volume).", status: "last", season: "2025–26" },
    { rule: "Short selling, margin", value: "Not allowed.", status: "last", season: "2023–24" },
    { rule: "First trade",          value: "At least one executed trade by early October (Oct 10 last season).", status: "last", season: "2025–26" },
    { rule: "Position limit",       value: "StockTrak's default caps one position at 25% of the portfolio. Whether Wharton uses it is on the Rules tab.", status: "verify", season: "unknown" }
  ],

  /* Was "verify on Sep 15". The materials are out, so these are the questions still open and which
     portal page answers each. Everything marked Trading/Deliverables is a page we have not pulled in. */
  verifyChecklist: [
    { q: "Starting cash for the real 2026\u201327 contest, and which contest is selected in WInS", where: "Trading" },
    { q: "Minimum share price ($5 last season) and whether it applies to foreign listings in local currency", where: "Trading" },
    { q: "Approved ETF and Treasury lists for 2026\u201327; is at least one ETF still required?", where: "Trading" },
    { q: "Short selling, margin, options, futures, mutual funds, crypto: on or off", where: "Trading" },
    { q: "Position limit percentage, volume limit, and whether practice trades count toward the trade cap", where: "Trading" },
    { q: "Commission per stock, ETF and Treasury trade", where: "Trading" },
    { q: "First-trade deadline and any minimum number of holdings or sectors", where: "Trading" },
    { q: "The Evaluation Criteria \u2014 the actual rubric the judges score against", where: "Deliverables" },
    { q: "IPS Requirements and Trading Notes Analysis Requirements: length, format, sections", where: "Deliverables" },
    { q: "What \"school documentation\" due Dec 4 means", where: "FAQs" },
    { q: "Whether every member needs their own SurveyMonkey Apply login for the roster", where: "FAQs" },
    { q: "ANSWERED by the Competition Guide: a Trading Note goes into WInS with each trade; the Oct 23 deliverable is a written analysis of THREE of them.", where: "done" }
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
    { d: "Monday", t: "Sector pitches", s: "Each person brings one idea from their sector and says which of Laura's goals it serves. Ten minutes each." },
    { d: "Tuesday", t: "Numbers and the bear case", s: "The numbers owner values anything the team liked. The risk owner writes the short case against it, and posts it before the vote." },
    { d: "Wednesday", t: "Vote and trade", s: "18 minutes, standing. 3 of 5 approves. Whoever proposes a trade writes its note the same day \u2014 everyone journals." },
    { d: "Friday", t: "Write", s: "Three lines each in the journal: what I learned, what I'd do differently, one number I watched. Then an hour on whatever the current phase is building." }
  ],

  announcements: [
    { date: "2026-09-16", text: "The case is out. Our client is Laura Gao \u2014 Wharton 2018, bestselling graphic novelist, building a creative residency in Taiwan in 2033. She invests $300,000 in 2027 and adds $150,000 in 2028, then owes ten fixed $50,000 payments from 2033 to 2042. Full case and the numbers are on the Case page; the Competition Guide is on the Playbook page." },
    { date: "2026-09-14", text: "Federico is in. We're five: Michael, Caleb, Dylan, Joe and Federico, one above Wharton's minimum. First team meeting is Tuesday at lunch or Wednesday zero period around 9:00 a.m.; Michael confirms the time in the chat." },
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
