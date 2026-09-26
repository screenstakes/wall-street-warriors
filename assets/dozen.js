/* Wall Street Warriors — Coach P's Nasdaq Dozen, scored.
   Data only. dozen.html renders it. Every number was read off a source page
   between Sep 24 and Sep 25, 2026 — see meta.sources at the bottom.

   Mark: "p" pass, "f" fail, "u" open (no usable reading yet). */
(function (root) {
  "use strict";

  var P = "p", F = "f", U = "u";

  var TESTS = [
    "Revenue increasing",
    "EPS increasing",
    "ROE up two years running",
    "Analysts say buy or strong buy",
    "All four earnings surprises positive",
    "Earnings forecast rising year over year",
    "5-year growth above 8%",
    "PEG under 1.0",
    "Beats its industry on P/E",
    "Days to cover under 2",
    "Insiders net buying",
    "Weighted alpha"
  ];

  /* The two tests nobody can score yet, written once and reused. */
  var PE9 = "Ambiguous as written. Coach P&rsquo;s document titles it &ldquo;Industry Price-Earnings&rdquo; but then says to pass if the company&rsquo;s <i>earnings</i> beat the industry&rsquo;s &mdash; and its Walmart example fails for having a <i>lower</i> P/E than its industry, which is backwards from how most people use it. The median P/E of these ten is <b>28.27</b>. We need the direction before we score it.";
  var WA12 = "Weighted alpha is a Barchart metric, not a Yahoo one, and Barchart blocks automated access. Coach P&rsquo;s document also cuts off before it defines the pass mark.";

  function co(tk, name, rows, extra) { return { tk: tk, name: name, rows: rows, extra: extra }; }

  var COMPANIES = [
    co("NVDA", "Nvidia", [
      [P, "Revenue up <b>105.9%</b> in a year"],
      [P, "Earnings up <b>125.9%</b>"],
      [F, "<b>119.18% &rarr; 101.48% &rarr; 117.21%</b> &mdash; fell, then recovered. Not two years running"],
      [P, "<b>Strong Buy</b>, target $327.70"],
      [P, "<b>+3.46, +5.32, +5.54, +6.16</b> &mdash; four for four"],
      [P, "EPS estimate <b>9.31 &rarr; 15.68</b> next year"],
      [P, "About <b>52%</b> a year (24.88 &divide; 0.48)"],
      [P, "PEG <b>0.48</b>"],
      [U, PE9],
      [F, "Short ratio <b>2.29</b> &mdash; over the 2-day line"],
      [F, "Net <b>3,745,500 shares sold</b> over 6 months"],
      [U, WA12]
    ], "Its two fails are insider selling and days to cover &mdash; both measure what insiders and traders did in the last few months. For something meant to run to 2033, neither tells you much. The ROE fail is a dip from 119% to 101% and back to 117%, which is a rounding error on numbers that high."),

    co("MSFT", "Microsoft", [
      [P, "Revenue up <b>17.7%</b>"],
      [P, "Earnings up <b>31.3%</b>"],
      [F, "<b>37.13% &rarr; 33.28% &rarr; 34.04%</b> &mdash; down, then up"],
      [P, "<b>Strong Buy</b>, target $576.40 from 55 analysts"],
      [P, "<b>+12.73, +5.69, +4.90, +11.81</b>"],
      [P, "EPS estimate <b>19.76 &rarr; 23.68</b>"],
      [P, "About <b>16%</b> a year (25.13 &divide; 1.62)"],
      [F, "PEG <b>1.62</b> &mdash; well over 1.0"],
      [U, PE9],
      [F, "Short ratio <b>3.21</b>"],
      [P, "Net <b>271,300 shares bought</b>, +4.20%"],
      [U, WA12]
    ], "Insiders are net buyers and analysts are at Strong Buy with the highest target count here. It fails PEG because it is priced for reliability, which is the trade-off, not a defect. It is also the only name on this page that is already on our Pile B shortlist."),

    co("AAPL", "Apple", [
      [P, "Revenue up <b>16.4%</b>"],
      [P, "Earnings up <b>27.1%</b>"],
      [F, "<b>157.41% &rarr; 171.42% &rarr; 148.75%</b> &mdash; up, then down"],
      [P, "<b>Buy</b> &mdash; but the $328.22 target is <i>below</i> the current price"],
      [P, "<b>+4.52, +6.34, +3.46, +6.74</b>"],
      [P, "EPS estimate <b>8.82 &rarr; 9.58</b>"],
      [P, "About <b>13%</b> a year (35.21 &divide; 2.71)"],
      [F, "PEG <b>2.71</b> &mdash; worst of the ten"],
      [U, PE9],
      [F, "Short ratio <b>3.03</b>"],
      [U, "Yahoo shows no insider data for Apple &mdash; all dashes. Next stop is the SEC&rsquo;s own EDGAR Form 4 search"],
      [U, WA12]
    ], "Look closely at test 4. Analysts rate it Buy, and their own average price target of $328.22 is below where it trades. They are saying buy a stock they think is worth less than its price. That is the clearest sign on this whole page that a rating is not the same as an opinion."),

    co("GOOGL", "Alphabet", [
      [P, "Revenue up <b>24.2%</b>"],
      [P, "Earnings up <b>297.9%</b> &mdash; one-time gain, see below"],
      [P, "<b>27.36% &rarr; 32.91% &rarr; 35.70%</b> &mdash; up two years running"],
      [P, "<b>Strong Buy</b>, target $429.46"],
      [P, "<b>+26.88, +7.01, +91.59, +214.23</b>"],
      [F, "EPS estimate <b>20.62 &rarr; 14.92</b> &mdash; the forecast <i>falls</i>"],
      [P, "About <b>18%</b> a year (22.83 &divide; 1.25)"],
      [F, "PEG <b>1.25</b>"],
      [U, PE9],
      [F, "Short ratio <b>3.68</b> &mdash; highest here"],
      [F, "<b>Zero</b> insider purchases and zero sales in 6 months"],
      [U, WA12]
    ], "Tests 2 and 5 pass on earnings a one-time gain inflated &mdash; then test 6 fails because next year&rsquo;s forecast is <i>lower</i> than this year&rsquo;s. The same gain scores as two passes and a fail on one scorecard. It is also the only name here where ROE genuinely rose two years running."),

    co("META", "Meta Platforms", [
      [P, "Revenue up <b>28.0%</b>"],
      [F, "Earnings <b>down 13.6%</b>"],
      [F, "<b>28.04% &rarr; 37.14% &rarr; 30.24%</b> &mdash; up, then down"],
      [P, "<b>Strong Buy</b> from 62 analysts, target $761.01"],
      [F, "<b>+8.00, +56.79, &minus;14.42, &minus;84.34</b> &mdash; two misses"],
      [P, "EPS estimate <b>31.21 &rarr; 34.03</b>"],
      [P, "About <b>23%</b> a year (22.08 &divide; 0.98)"],
      [P, "PEG <b>0.98</b> &mdash; just under"],
      [U, PE9],
      [P, "Short ratio <b>1.68</b> &mdash; under 2"],
      [P, "Net <b>1,173,870 shares bought</b>, +45.30%"],
      [U, WA12]
    ], "The strongest insider signal on the page &mdash; net buying of 45.3%, by far the highest here &mdash; sitting right next to the worst earnings record. Insiders are buying into the AI spending that is currently shrinking the profit. Whichever way you read that, it is a real argument."),

    co("AVGO", "Broadcom", [
      [P, "Revenue up <b>85.5%</b>"],
      [P, "Earnings up <b>216.1%</b>"],
      [F, "<b>60.31% &rarr; 13.46% &rarr; 31.05%</b> &mdash; collapsed, then partly recovered"],
      [P, "<b>Strong Buy</b> from 50 analysts, target $531.85"],
      [P, "<b>+4.38, +1.32, +1.74, +2.53</b>"],
      [P, "EPS estimate <b>11.66 &rarr; 19.38</b>"],
      [P, "About <b>54%</b> a year (19.42 &divide; 0.36)"],
      [P, "PEG <b>0.36</b> &mdash; lowest of the ten"],
      [U, PE9],
      [F, "Short ratio <b>2.01</b> &mdash; misses by 0.01"],
      [F, "Net <b>375,677 shares sold</b> over 6 months"],
      [U, WA12]
    ], "That ROE line is worth a second look &mdash; 60% to 13% to 31% in three years is not a business getting steadily better, it is one being reshaped by acquisitions. And it misses days to cover by a hundredth of a point, which tells you how much weight that test deserves."),

    co("TSM", "Taiwan Semiconductor", [
      [P, "Revenue up <b>36.0%</b>"],
      [P, "Earnings up <b>77.4%</b>"],
      [P, "<b>26.71% &rarr; 29.94% &rarr; 35.04%</b> &mdash; up two years running"],
      [P, "<b>Strong Buy</b>, target $552.26"],
      [U, "Yahoo&rsquo;s Analysis page errored twice. Still to retry"],
      [U, "Same page. Still to retry the Analysis tab"],
      [P, "About <b>25%</b> a year (21.41 &divide; 0.86)"],
      [P, "PEG <b>0.86</b>"],
      [U, PE9],
      [F, "Short ratio <b>2.88</b>"],
      [U, "Zero purchases, sales not shown &mdash; no usable reading"],
      [U, WA12]
    ], "One of only four names whose ROE actually rose two years running, and the cleanest version of that trend here. Still carries the Taiwan question the team already worked through on VEA."),

    co("ORCL", "Oracle", [
      [P, "Revenue up <b>29.6%</b>"],
      [P, "Earnings up <b>62.6%</b>"],
      [F, "<b>82.38% &rarr; 53.38% &rarr; 41.19%</b> &mdash; halved over two years"],
      [P, "<b>Buy</b> from 43 analysts, target $237.97"],
      [P, "<b>+38.04, +5.69, +7.52, +10.45</b>"],
      [P, "EPS estimate <b>8.14 &rarr; 11.00</b>"],
      [P, "About <b>22%</b> a year (17.76 &divide; 0.81)"],
      [P, "PEG <b>0.81</b>"],
      [U, PE9],
      [U, "Yahoo showed no short ratio for Oracle"],
      [P, "Net <b>422,063 shares bought</b> over 6 months"],
      [U, WA12]
    ], "Eight of ten, second highest here &mdash; on a company burning $45.85B of free cash flow with debt at 252% of equity that dropped 3.5% on a delayed datacenter notice. Its one fail is ROE, and that fail is real: 82% to 53% to 41% is the borrowing showing up. That single row is the only hint the screen gives you about the balance sheet."),

    co("AMD", "Advanced Micro Devices", [
      [P, "Revenue up <b>50.1%</b>"],
      [P, "Earnings up <b>163.4%</b>"],
      [P, "<b>2.89% &rarr; 7.08% &rarr; 10.20%</b> &mdash; up two years running"],
      [P, "<b>Strong Buy</b>, target $616.51"],
      [P, "<b>+2.48, +15.98, +5.82, +3.21</b>"],
      [P, "EPS estimate <b>7.58 &rarr; 15.58</b>"],
      [P, "About <b>63%</b> a year (39.53 &divide; 0.63)"],
      [P, "PEG <b>0.63</b>"],
      [U, PE9],
      [F, "Short ratio <b>2.23</b>"],
      [P, "Net <b>562,402 shares bought</b>, +8.90%"],
      [U, WA12]
    ], "The top scorer on the page at 9 of 10, and the clearest demonstration of what the Dozen cannot see. Its ROE rises because it started at 2.89%, which is a low base, not a strong business. Its margin is 15.58% against Nvidia&rsquo;s 63.66%. Its trailing P/E is 156.79. The screen has no test for any of that. If we present one stock to make the point about screens, it is this one."),

    co("CRM", "Salesforce", [
      [P, "Revenue up <b>10.8%</b> &mdash; slowest here, but still up"],
      [P, "Earnings up <b>86.9%</b>"],
      [P, "<b>7.01% &rarr; 10.26% &rarr; 19.38%</b> &mdash; up two years running"],
      [P, "<b>Buy</b> from 54 analysts, target $281.08"],
      [U, "Yahoo&rsquo;s Analysis page errored twice. Still to retry"],
      [U, "Same page. Still to retry the Analysis tab"],
      [P, "About <b>18%</b> a year (13.99 &divide; 0.78)"],
      [P, "PEG <b>0.78</b>"],
      [U, PE9],
      [P, "Short ratio <b>1.97</b> &mdash; under 2"],
      [U, "Yahoo shows no insider data for Salesforce &mdash; all dashes"],
      [U, WA12]
    ], "Zero fails on everything that could be scored, ROE tripling over three years, and the market still marked it down 20%. Either the screen is seeing something the market missed, or the market is pricing in the 10.8% growth rate the screen treats as a pass.")
  ];

  root.DOZEN = {
    tests: TESTS,
    companies: COMPANIES,
    meta: {
      pulled: "Sep 24–25, 2026",
      doc: "https://docs.google.com/document/d/1H4C5IKaxnWswvGOjVD8fN7s5An-823yXhOpr99dQDAg/edit"
    }
  };
})(window);
