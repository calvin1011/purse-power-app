# Smart Save

Build a mobile-first web app prototype for a receipt-based savings and loyalty platform. This is a consumer app where users scan receipts from any store or restaurant, and the app instantly shows them savings they missed, cheaper alternatives nearby, deals they can use on their next visit, and stores all their receipts in one searchable place. Think of it as a universal savings layer across all retail and dining.

Design direction:

Clean, modern, minimal UI with a premium feel. Not coupon-clipper energy. Think Robinhood meets Cash App meets Apple Wallet. The vibe should say "smart money" not "bargain hunter"

Dark mode as default with a vibrant accent color (electric green or bright teal for savings/money themes)

Rounded cards, smooth transitions, large readable typography

Bottom tab navigation, mobile-native feel even though it's web

No clutter. Whitespace is a feature

Screens to build:

Onboarding flow (3 screens):

Screen 1: Hero illustration or animation with tagline. Something like "Stop leaving money on the table." with a subline "Scan any receipt. Find instant savings." and a "Get Started" button

Screen 2: Quick value prop cards the user swipes through - "See what you missed" / "Find cheaper nearby" / "All your receipts, one place" / "Deals that actually match you"

Screen 3: Optional account creation with email/Google/Apple sign-in options AND a clearly visible "Skip for now - start scanning" option at the bottom. No forced gate

Home screen (the dashboard):

Top: greeting with first name (or "Hey there" if no account) and a running "Total Saved" stat prominently displayed (e.g. "$127.40 saved so far")

Below that: a large, prominent "Scan Receipt" button (camera icon, centered, impossible to miss - this is the primary CTA on every visit)

Section: "Deals Near You" - horizontal scrollable cards showing nearby deals with store logo, deal description, distance, and expiration. Each card is tappable

Section: "Your Recent Scans" - vertical list of recent receipts as cards showing store name, date, total spent, and a small badge if savings were found (e.g. "You missed $3.20")

Section: "Weekly Snapshot" - a simple card showing total spent this week, number of receipts scanned, and total savings discovered

Scan receipt flow:

Camera view with a receipt outline guide overlay and a capture button

Processing screen with a subtle loading animation ("Finding your savings...")

Results screen: Show the receipt summary at top (store name, date, total, itemized list). Below that, a "Savings Found" section with cards for each finding:

"This item is $1.50 cheaper at [Store Name] (0.4 mi away)" with a map pin icon

"You qualified for [Deal Name] but didn't use it" with a "Save for next time" button

"Similar item on sale at [Store Name] this week" with price comparison

Bottom of results: "Save Receipt" button and "Share Savings" button

If no savings found, show an encouraging message like "No savings this time, but we're learning your habits. Keep scanning!"

Receipt vault screen:

Searchable list of all saved receipts organized by date (most recent first)

Each receipt card shows: store logo/name, date, total amount, item count, and a savings badge if applicable

Filter options: by store, by date range, by category (groceries, dining, retail, etc.)

Tapping a receipt opens a detail view showing the full itemized receipt with any associated deals or savings noted inline

Deals / Explore screen:

Map view toggle at top showing deal pins near the user's location

Below map: filterable deal cards organized by category (Food, Grocery, Retail, Services)

Each deal card: merchant logo, deal description, distance, expiration countdown, and a "Save Deal" or "Use Deal" button

A "Trending Deals" section at top showing most-saved deals in the area

A "Based on Your Purchases" section (can be placeholder/mocked for now) showing personalized deal recommendations

Profile / Settings screen:

Profile section: name, email, avatar, account creation prompt if they skipped

Stats card: total receipts scanned, total savings found, total deals used, member since date

Achievements/streaks section: scanning streak counter, milestones like "First $50 saved" or "10 receipts scanned" with badge icons

Referral section: "Share with friends" with a referral code/link and a tracker showing how many friends joined

Savings goal: optional feature where user sets a monthly savings target and sees progress

Settings: notification preferences, location permissions, dark/light mode toggle, privacy settings

Deal detail screen (when user taps a specific deal):

Large merchant header with logo and name

Deal details: what the deal is, conditions, expiration

"How to redeem" instructions

Map showing the merchant location with directions option

"Share this deal" button

"Similar deals nearby" section at bottom

Data to mock:

Use realistic store names (Target, Walmart, Chipotle, Starbucks, CVS, Kroger, local-sounding restaurant names like "Meso Maya" or "Pecan Lodge")

Realistic receipt amounts and item names

Savings amounts between $0.50 and $8.00 per receipt

Deals like "Buy one get one free," "$2 off orders over $15," "15% off your next visit"

Show the user has scanned 23 receipts and saved $127.40 total

Interactions to include:

Bottom tab navigation between Home, Scan, Deals, Receipts, Profile (5 tabs, Scan is center and elevated/highlighted)

Tappable cards throughout

The scan button should feel like the most important action on every screen

Smooth transitions between screens

Pull to refresh on the home screen

Do NOT include:

No merchant admin dashboard (consumer app only for this mockup)

No payment processing or checkout flows

No chat or messaging features

No complex ML/AI interfaces. The "intelligence" should feel invisible - just better deal recommendations, not a visible AI feature

Build this as a fully navigable prototype with all screens connected. Use placeholder images where needed but make the data feel real. The app should feel like something you'd actually download and use daily.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96461a7a-b5d8-4d87-8847-04bba0a79515).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
