# Contexto de Referência — Módulo 4.4: Estratégia de pricing


## Fonte: _OceanofPDF.com_Lean_Analytics_-_Alistair_Croll_Benjamin_Yoskovitz.md

nds and constant changes. And folks at Totango, Price Intelligently, Chartbeat, Startup Compass, and others all dug into anonymized customer data to enlighten us on things like Software as a Service, pricing, engagement, and average metrics. 

But most of all, we want to thank people who challenged us, shared with us, and opened their kimonos to tell us the good and bad parts of startups, often having to fight for approval to talk publicly. Some weren’t able to, despite their best efforts, and we’ll leave their stories for another day—but every piece of feedback helped shape this book and our understanding of how analytics and Lean Startup methods intertwine. 

Preface 

xxiv 

## **PA R T  O N E :** 

## **STOP LYING TO YOURSELF** 

In this part of the book, we’ll look at why you need data to succeed. We’ll tackle some basic analytical concepts like qualitative and quantitative data, vanity metrics, correlation, cohorts, segmentation, and leading indicators. We’ll consider the perils of being too data-driven. And we’ll even think a bit about what you should be doing with your life. 

_It depends on what the meaning of the word “is” is._ William Jefferson Clinton 

**C H A P T E R  1** 

## **We’re All Liars** 

Let’s face it: you’re delusional. 

We’re all delusional—some more than others. Entrepreneurs are the most delusional of all. 

Entrepreneurs are particularly good at lying to themselves. Lying may even be a prerequisite for succeeding as an entrepreneur—after all, you need to convince others that something is true in the absence of good, hard evidence. You need believers to take a leap of faith with you. As an entrepreneur, you need to live in a semi-delusional state just to survive the inevitable rollercoaster ride of running your startup. 

Small lies are essential. They create your reality distortion field. They are a necessary part of being an entrepreneur. But if you start believing your own hype, you won’t survive. You’ll go too far into the bubble you’ve created, and you won’t come out until you hit the wall—hard—and that bubble bursts. 

You need to lie to yourself, but not to the point where you’re jeopardizing your business. 

_That’s where data comes in_ . 

Your delusions, no matter how convincing, will wither under the harsh light of data. Analytics is the necessary counterweight to lying, the yin to the yang of hyperbole. Moreover, data-driven learning is the cornerstone of success in startups. It’s how you learn what’s working and iterate toward the right product and market before the money runs out. 

3 

We’re not suggesting that gut instinct is a bad thing. Instincts are inspiration, and yo

---

es margins, the cost of sales, revenue per employee, and so on. 

PArT oNe: SToP LYING To YoUrSeLF 

10 

- “Experimental” metrics, like the results of a test, help you to optimize the product, pricing, or market. Changes in these metrics will significantly change your behavior. Agree on what that change will be before you collect the data: if the pink website generates more revenue than the alternative, you’re going pink; if more than half your respondents say they won’t pay for a feature, don’t build it; if your curated MVP doesn’t increase order size by 30%, try something else. 

Drawing a line in the sand is a great way to enforce a disciplined approach. A good metric changes the way you behave precisely _because_ it’s aligned to your goals of keeping users, encouraging word of mouth, acquiring customers efficiently, or generating revenue. 

Unfortunately, that’s not always how it happens. 

Renowned author, entrepreneur, and public speaker Seth Godin cites several examples of this in a blog post entitled “Avoiding false metrics.”[*] Funnily enough (or maybe not!), one of Seth’s examples, which involves car salespeople, recently happened to Ben. 

While finalizing the paperwork for his new car, the dealer said to Ben, “You’ll get a call in the next week or so. They’ll want to know about your experience at the dealership. It’s a quick thing, won’t take you more than a minute or two. It’s on a scale from 1 to 5. You’ll give us a 5, right? Nothing in the experience would warrant less, right? If so, I’m very, very sorry, but a 5 would be great.” 

Ben didn’t give it a lot of thought (and strangely, no one ever did call). Seth would call this a _false metric_ , because the car salesman spent more time asking for a good rating (which was clearly important to him) than he did providing a great experience, which was supposedly what the rating was for in the first place. 

Misguided sales teams do this too. At one company, Alistair saw a sales executive tie quarterly compensation to the number of deals in the pipeline, rather than to the number of deals closed, or to margin on those sales. Salespeople are coin-operated, so they did what they always do: they followed the money. In this case, that meant a glut of junk leads that took two quarters to clean out of the pipeline—time that would have been far better spent closing qualified prospects. 

Of course, customer satisfaction or pipeline flow is vital to a successful business. But if you want to change behavior, your metric must be tied to the behavioral change you want. If you measure something and it’s not 

> * _http://sethgodin.typepad.com/seths_blog/2012/05/avoiding-false-metric

---

echniques. Since the days of Frederick Winslow Taylor, we have assessed the skill of managers by comparing their results to the forecast. Beat the plan, get a promotion. Miss the plan, and your stock price declines. And for some kinds of products, this works just fine. Accurate forecasting requires a long and stable operating history from which to make the forecast. The longer and more stable, the more accurate. 

And yet who really feels like the world is getting more and more stable every day? Whenever conditions change, or we attempt to change them by introducing a truly new product, accurate forecasting becomes nearly impossible. And without that yardstick, how do we evaluate if we’re making progress? If we’re busy building the wrong product, why should we be proud to be doing it on time and on budget? This is the reason we need a new understanding of how to measure progress, both for ourselves as entrepreneurs and managers, as investors in the companies we fund,  and the teams under our purview. 

That is why an accounting revolution is required if we’re to succeed in this new era of work. And Ben and Alistair have done the incredibly hard work of surveying the best thinking on the metrics and analytics, gathering in-depth examples, and breaking new ground in presenting their own frameworks for figuring out which metrics matter, and when. Their work collecting industry-wide benchmarks to use for a variety of key metrics is worth the price of admission all by itself. 

This is not a theoretical work, but a guide for all practitioners who seek new sources of growth. I wish you happy hunting. 

Eric Ries San Francisco February 4, 2013 

ForeworD 

xviii 

## **Preface** 

The Lean Startup movement is galvanizing a generation of entrepreneurs. It helps you identify the riskiest parts of your business plan, then finds ways to reduce those risks in a quick, iterative cycle of learning. Most of its insights boil down to one sentence: _Don’t sell what you can make; make what you can sell_ . And that means figuring out what people want to buy. 

Unfortunately, it’s hard to know what people really want. Many times, they don’t know themselves. When they tell you, it’s often what they think you want to hear.* What’s worse, as a founder and entrepreneur, you have strong, almost overwhelming preconceptions about how other people think, and these color your decisions in subtle and insidious ways. 

Analytics can help. Measuring something makes you accountable. You’re forced to confront inconvenient truths. And you don’t spend your life and your money building something nobody wants. 

_Lean Startup_ helps you structure your progress and ide

---

tically co-authors. Sonia Gaballa of Nudge Design did great work with our website, and the production team at O’Reilly put up with our unreasonable demands and constant changes. And folks at Totango, Price Intelligently, Chartbeat, Startup Compass, and others all dug into anonymized customer data to enlighten us on things like Software as a Service, pricing, engagement, and average metrics. 

But most of all, we want to thank people who challenged us, shared with us, and opened their kimonos to tell us the good and bad parts of startups, often having to fight for approval to talk publicly. Some weren’t able to, despite their best efforts, and we’ll leave their stories for another day—but every piece of feedback helped shape this book and our understanding of how analytics and Lean Startup methods intertwine. 

Preface 

xxiv 

## **PA R T  O N E :** 

## **STOP LYING TO YOURSELF** 

In this part of the book, we’ll look at why you need data to succeed. We’ll tackle some basic analytical concepts like qualitative and quantitative data, vanity metrics, correlation, cohorts, segmentation, and leading indicators. We’ll consider the perils of being too data-driven. And we’ll even think a bit about what you should be doing with your life. 

_It depends on what the meaning of the word “is” is._ William Jefferson Clinton 

**C H A P T E R  1** 

## **We’re All Liars** 

Let’s face it: you’re delusional. 

We’re all delusional—some more than others. Entrepreneurs are the most delusional of all. 

Entrepreneurs are particularly good at lying to themselves. Lying may even be a prerequisite for succeeding as an entrepreneur—after all, you need to convince others that something is true in the absence of good, hard evidence. You need believers to take a leap of faith with you. As an entrepreneur, you need to live in a semi-delusional state just to survive the inevitable rollercoaster ride of running your startup. 

Small lies are essential. They create your reality distortion field. They are a necessary part of being an entrepreneur. But if you start believing your own hype, you won’t survive. You’ll go too far into the bubble you’ve created, and you won’t come out until you hit the wall—hard—and that bubble bursts. 

You need to lie to yourself, but not to the point where you’re jeopardizing your business. 

_That’s where data comes in_ . 

Your delusions, no matter how convincing, will wither under the harsh light of data. Analytics is the necessary counterweight to lying, the yin to the yang of hyperbole. Moreover, data-driven learning is the cornerstone of success in startups. It’s how you learn what’s working and iterate toward th

---


## Fonte: venture-capital-strategy-how-to-think-like-a-venture-capitalist-1089935226-9781089935223_compress.md

e will come back to the science of valuations once we have had a chance to investigate rest of the VC Job Cycle. 

## Convertible Notes 

As we see above, coming up with a valuation (also called “pricing the deal”) is a sticky proposition, and it gets stickier the earlier in the life of the startup, at the seed stage. There is tremendous pressure on getting the price right. Price it too low, and we may disincentivize the founding team by diluting them too much. Price it too high, and there is the danger of a down 

round, in which the next round has a devaluation (the repercussions of which are explained in the next chapter). 

One to avoid a valuation is way negotiating seed stage by issuing a convertible note. This is basically a loan that functions a lot like an equity investment. Officially, it is debt. The startup is borrowing money from investors. There is an interest rate and a maturity date, just like any loan. 

However, the intention of the loan is different. It is not intended to get paid back in cash like a regular loan. Rather, the hope is that the startup will use the cash to hit milestones so that it can raise a Series A, its first institutional funding. When that happens, the loan will convert to equity, essentially being repaid in the form of equity. 

The convertible note allows us to invest today without pricing the round, thus avoiding a potentially messy negotiation about valuation. By the time the next equity round is needed, the startup should have hit milestones that help define a mutually agreeable range of valuations. 

On the other hand, if the startup does not make it to another round of financing, there is often nothing left with which to repay the loan. This results in a loan that acts a lot like equity, sharing in the upside (by converting to equity) or going nearly to zero on the downside. 

For the extra risk of investing early, issuers of convertible notes receive a discount on their equity once it gets priced, commonly 20%. For example, if the Series A pre-money valuation is $5M, the convertible note will convert at a price of $4M, resulting in bonus shares for the note holders. 

VCs sometimes see convertible debt as the lesser of two evils: better to deal with a convertible note as we negotiate a Series A than to deal with the fallout of a mispriced seed round. As VCs, we wouldn’t want to come in on a deal that had been priced too low by the previous investors because we’d run into the serious risk of over-diluting the 

in the seed founders. They already gave up more than they should have round. 

Conversely, if the seed round had been overpriced, we don’t want to have to impose a down round b

---

ose a down round because it would create turbulence between founders, early investors and current investors. We need everyone on the same team! 

A convertible note could be a nice way to avoid bad pricing scenarios. However, over the last few years, valuation caps have come into fashion with convertible debt can act as de facto valuations. A valuation cap puts a limit on the price at which the convertible note will convert in the next round. This is to protect the debt issuers from dilution. 

For example, let’s look at a case with no discount and a $500k convertible note. If the startup goes on to raise a $1.5M Series A investment on a $3M pre-money valuation, the total post-money would be $5M. The holders of the note would have .5/5 or 10% ownership. 

In that same case, if the Series A were a $5M raise on a $10M pre-money, the resulting post-money would be $15.5M and the note would convert into about 3% ownership. The higher the valuation on the Series A, the lower the percent ownership of the issuers of the convertible note. Hence the incentive to impose a cap to limit dilution. 

There are some further complications around convertible notes, such as whether the note converts pre-money (diluting only the founders) or postmoney (diluting everyone, as in my example above). Also, interest must be charged for the note to be legally considered a loan. This can be anywhere from 2-8% annually. 

Perhaps the most significant complication is the necessary inclusion of a maturity date, that is, the date that the loan becomes due, usually set at 18-24 months. After that period, the issuers of the note could call for repayment and disrupt the operations of the startup, effectively bankrupting it. 

This would only happen if the startup were failing in the eyes of the debt holders. However, the chances of recouping the loan plus interest are minimal at best. Recall, the startup received this cash two years ago with the goal of spending it in hopes of hitting milestones to attract VCs. If the startup has not succeeded, it likely has run out of cash, meaning it cannot repay. 

Still, this provision gives the convertible note investors some assurance that they may have recourse, and it scares some founders into worrying they may be at the mercy of debt collectors. To address these risks and others, Y-Combinator came up with a replacement investment vehicle in 2013 called a SAFE, a “Simple Agreement for Future Equity.” 

A SAFE basically does the same thing as convertible debt minus the interest and maturity date, two things that favored the investor over the founders. Y-Combinator’s SAFE was soon followed by 500 Startups’ KISS, “Keep It Simple Sec

---

ing “Business Model” Growth vs. Proftability Path to Exit Barriers to Scalability Scalability and Product/Market Fit Customer Acquisition Cost (CAC) Lifetime Value (LTV) Products vs. Services Margins Revenue Model Business Model Summary 

## C. Fund Fit 

7. Growth Milestones 

Milestones and Risk 

Use of Funds Building Equity Hit Movie Example Airbnb Example Negotiated and Time Limited Dilution and Participation Series A Golden Rule Growth Milestones Summary 8. Exit Strategy 

- Startups are like 9 Volt Batteries Beach House Example Should we add a Swimming Pool? Exit Valuation Comps Exit Strategy Summary 9. Return Analysis VC Razor Fund II, First Investment Breaking it Down Seed Round Series A Series B Series C Fund Fit Alert! To the Exit Back to the Forest Series A Norms Return Analysis Summary 

## APPENDICES 

VC Razor Due Diligence Checklist Due Diligence Advice Glossary Partial Sources Acknowledgements About the Author Index 

## VC M AT H T O P I C S B Y C H A P T E R 

Basic VC Math 29 

- Deal algebra Determining ownership Difference between two offers 

- Fundraising 49 Fund size algebra Recycling fees 

- Tripling the fund 

- Investing 87 Option pools Liquidation preferences 

- Growing 114 

   - Dilution across several rounds Up and down rounds 

- Exiting 131 

   - Cash on cash ‘X’ return potential Returning the fund 

   - Using norms 

- Return Analysis 288 

   - Breaking it Down Series A, B, C 

   - To the Exit 

   - Norms 

   - Story about a Number 

## INTRODUCTION 

## Why Another Venture Capital Book? 

The simple answer: I believe venture capital should be approached as a subject of entrepreneurial strategy, not finance. I have taught venture capital classes and run a global venture capital competition for over 15 years. Throughout that time, I have struggled to find materials for my students, frustrated by the simultaneous abundance and lack of available content. 

There is an abundance of terrific blogs written by VCs and founders, usually teaching specific lessons relevant to specific circumstances. Many VCs are prolific writers and have covered a wide variety of topics of the VC investment process. However, most blog postings have a very narrow scope and are not organized into a coherent body of work. They do a great job of examining each tree, but the forest gets lost. 

Similarly, there are plenty of textbooks that treat venture capital as a topic of finance. Wrong forest! Venture capital is undeniably a subset of private equity. However, approaching the industry from that perspective ignores the vast majority of what VCs actually do: bring new technologies into

---

artners are stuck together until the exit. So choose wisely! 

## Equity to Fuel Growth 

As mentioned above, equity is considered expensive money. If you can grow organically by reinvesting your revenues or borrowing from a bank, you should probably do so. However, growth can be very expensive, and, of course, risky. That’s where equity comes in. 

The old-fashioned way to start and grow a business is a long slog of acquiring paying customers and growing slowly and steadily over time, living off a meager (but growing) salary and plowing most the money the company makes back into the business (called retained earnings by accountants). With any luck, the business grows relatively steadily over time, perhaps with some fits and starts. 

**==> picture [167 x 160] intentionally omitted <==**

Everything changes with venture capital. The whole point of equity investing is to accelerate growth. The tired but true cliché is that VCs are looking for hockey stick growth. The hope is to find growth inflection points, where an injection of capital can have a disproportionate effect on the slope of the curve. 

## Figure: Hockey stick vs. normal growth 

However, this curve is misleading. With equity investments, you actually have discrete funding moments, called rounds, which create a bumpy road in terms of the actual growth trajectory. These equity rounds follow a typical pattern: 

   - The initial cash and sweat equity that founders supply to get going (called skin in the game), 

   - Often followed by investments from friends and family (and sometimes fools), Moving on to angel and seed investors, and finally, Institutional investors (venture capitalists). 

- Traditionally, venture capitalists enter the picture when the 

- investment size is in the $2M-25M range, though some smaller VC firms specifically target seed stage investing, and some larger firms have side funds to invest in earlier stage startups. This first round of VC funding, i.e., the first institutional round, is dubbed Series A, and will be followed by Series B, C, etc., until exit. Below are some typical ranges for rounds of financing, but of course, there are plenty of outliers. 

Figure: Rounds of equity financing 

**==> picture [378 x 231] intentionally omitted <==**

Early stage refers to most any startup near the left of this pattern, with later stage referring to startups that fall to the right, say Series C and later, getting close to an exit. Some firms, for example, called mezzanine funds, only invest in rounds just before the exit. In so doing, they have a risk/reward profile that can look more similar to private equity firms than to early stage VC fir

---

