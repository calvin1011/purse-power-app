export type Category = "Grocery" | "Dining" | "Retail" | "Services";

export type ReceiptItem = {
  name: string;
  qty: number;
  price: number;
};

export type Saving = {
  id: string;
  kind: "cheaper" | "missed-deal" | "sale";
  title: string;
  detail: string;
  amount: number;
  store: string;
  distance?: string;
};

export type Receipt = {
  id: string;
  store: string;
  category: Category;
  date: string; // ISO
  total: number;
  items: ReceiptItem[];
  savings: Saving[];
};

export type Deal = {
  id: string;
  merchant: string;
  category: Category;
  title: string;
  description: string;
  distance: string;
  expires: string;
  conditions: string;
  redeem: string;
  trending?: boolean;
  personalized?: boolean;
  saves: number;
};

export const brandColors: Record<string, string> = {
  Target: "oklch(0.62 0.22 25)",
  Walmart: "oklch(0.65 0.17 250)",
  Chipotle: "oklch(0.52 0.12 40)",
  Starbucks: "oklch(0.55 0.13 155)",
  CVS: "oklch(0.6 0.2 20)",
  Kroger: "oklch(0.55 0.15 255)",
  "Meso Maya": "oklch(0.68 0.17 60)",
  "Pecan Lodge": "oklch(0.58 0.13 50)",
  "Trader Joe's": "oklch(0.6 0.16 30)",
  "Whole Foods": "oklch(0.6 0.15 145)",
  "Sweetgreen": "oklch(0.68 0.16 140)",
  Walgreens: "oklch(0.6 0.18 250)",
  "Velvet Taco": "oklch(0.6 0.19 350)",
};

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const TOTAL_SAVED = 127.4;
export const TOTAL_RECEIPTS = 23;
export const TOTAL_DEALS_USED = 9;

export const receipts: Receipt[] = [
  {
    id: "r1",
    store: "Target",
    category: "Retail",
    date: "2026-09-05T18:22:00Z",
    total: 64.18,
    items: [
      { name: "Tide Pods 42ct", qty: 1, price: 18.99 },
      { name: "Paper Towels 6pk", qty: 1, price: 12.49 },
      { name: "Greek Yogurt 4pk", qty: 2, price: 5.79 },
      { name: "AA Batteries 8ct", qty: 1, price: 9.49 },
      { name: "Sparkling Water 12pk", qty: 1, price: 6.99 },
    ],
    savings: [
      {
        id: "s1",
        kind: "cheaper",
        title: "Tide Pods are $3.20 cheaper at Walmart",
        detail: "$15.79 at Walmart vs $18.99 here",
        amount: 3.2,
        store: "Walmart",
        distance: "0.4 mi away",
      },
      {
        id: "s2",
        kind: "missed-deal",
        title: "You qualified for $5 off $50 Circle offer",
        detail: "The offer was active but never applied at checkout",
        amount: 5,
        store: "Target",
      },
    ],
  },
  {
    id: "r2",
    store: "Chipotle",
    category: "Dining",
    date: "2026-09-04T12:41:00Z",
    total: 23.85,
    items: [
      { name: "Chicken Burrito Bowl", qty: 1, price: 11.25 },
      { name: "Barbacoa Burrito", qty: 1, price: 12.6 },
    ],
    savings: [
      {
        id: "s3",
        kind: "missed-deal",
        title: "BOGO entrée was available on Fridays",
        detail: "Bring the same order next Friday to use it",
        amount: 11.25,
        store: "Chipotle",
      },
    ],
  },
  {
    id: "r3",
    store: "Kroger",
    category: "Grocery",
    date: "2026-09-02T09:15:00Z",
    total: 112.44,
    items: [
      { name: "Chicken Breast 3lb", qty: 1, price: 14.97 },
      { name: "Olive Oil 500ml", qty: 1, price: 11.99 },
      { name: "Coffee Beans 12oz", qty: 1, price: 13.49 },
      { name: "Eggs 18ct", qty: 1, price: 6.29 },
      { name: "Bananas", qty: 1, price: 2.14 },
      { name: "Pasta Sauce", qty: 3, price: 3.99 },
    ],
    savings: [
      {
        id: "s4",
        kind: "sale",
        title: "Coffee beans on sale at Trader Joe's this week",
        detail: "$8.99 vs $13.49 · same 12oz medium roast",
        amount: 4.5,
        store: "Trader Joe's",
        distance: "1.1 mi away",
      },
      {
        id: "s5",
        kind: "cheaper",
        title: "Olive oil is $2.10 cheaper at Whole Foods",
        detail: "$9.89 for the same 500ml bottle",
        amount: 2.1,
        store: "Whole Foods",
        distance: "0.9 mi away",
      },
    ],
  },
  {
    id: "r4",
    store: "Starbucks",
    category: "Dining",
    date: "2026-09-01T07:58:00Z",
    total: 9.4,
    items: [
      { name: "Grande Cold Brew", qty: 1, price: 5.45 },
      { name: "Butter Croissant", qty: 1, price: 3.95 },
    ],
    savings: [],
  },
  {
    id: "r5",
    store: "Meso Maya",
    category: "Dining",
    date: "2026-08-30T20:10:00Z",
    total: 78.6,
    items: [
      { name: "Enchiladas Suizas", qty: 2, price: 21.0 },
      { name: "Guacamole", qty: 1, price: 12.0 },
      { name: "Horchata", qty: 2, price: 6.0 },
      { name: "Flan", qty: 1, price: 9.0 },
    ],
    savings: [
      {
        id: "s6",
        kind: "missed-deal",
        title: "15% off dinner for OpenTable diners",
        detail: "Save it for your next visit and we'll remind you",
        amount: 7.86,
        store: "Meso Maya",
      },
    ],
  },
  {
    id: "r6",
    store: "CVS",
    category: "Services",
    date: "2026-08-28T16:04:00Z",
    total: 31.27,
    items: [
      { name: "Allergy Tablets 30ct", qty: 1, price: 16.99 },
      { name: "Sunscreen SPF 50", qty: 1, price: 11.29 },
      { name: "Gum", qty: 1, price: 2.99 },
    ],
    savings: [
      {
        id: "s7",
        kind: "cheaper",
        title: "Allergy tablets are $1.50 cheaper at Walgreens",
        detail: "$15.49 for the same 30ct box",
        amount: 1.5,
        store: "Walgreens",
        distance: "0.4 mi away",
      },
    ],
  },
  {
    id: "r7",
    store: "Pecan Lodge",
    category: "Dining",
    date: "2026-08-26T13:30:00Z",
    total: 54.2,
    items: [
      { name: "Brisket Plate", qty: 2, price: 22.0 },
      { name: "Sweet Tea", qty: 2, price: 3.5 },
      { name: "Banana Pudding", qty: 1, price: 6.0 },
    ],
    savings: [],
  },
];

export const deals: Deal[] = [
  {
    id: "d1",
    merchant: "Chipotle",
    category: "Dining",
    title: "Buy one get one free entrée",
    description: "Every Friday, buy any entrée and get a second one free.",
    distance: "0.3 mi",
    expires: "Ends in 2 days",
    conditions: "Dine-in or pickup only. One per customer per visit.",
    redeem: "Show this screen at the register before you pay.",
    trending: true,
    personalized: true,
    saves: 1420,
  },
  {
    id: "d2",
    merchant: "Target",
    category: "Retail",
    title: "$5 off orders over $50",
    description: "Circle offer applied automatically to household essentials.",
    distance: "0.8 mi",
    expires: "Ends Sunday",
    conditions: "Excludes gift cards, alcohol and clearance items.",
    redeem: "Scan the barcode in the Circle section at checkout.",
    trending: true,
    saves: 980,
  },
  {
    id: "d3",
    merchant: "Starbucks",
    category: "Dining",
    title: "$2 off orders over $15",
    description: "Afternoon pick-me-up on the house, sort of.",
    distance: "0.2 mi",
    expires: "Ends in 5 hours",
    conditions: "Valid 2pm–6pm daily.",
    redeem: "Ask the barista to apply the in-store promo code SAVE2.",
    personalized: true,
    saves: 640,
  },
  {
    id: "d4",
    merchant: "Kroger",
    category: "Grocery",
    title: "15% off your next visit",
    description: "Loyalty members get 15% off a full grocery run.",
    distance: "1.2 mi",
    expires: "Ends in 6 days",
    conditions: "Requires a Kroger Plus card. Max discount $30.",
    redeem: "Enter your phone number at the pin pad.",
    trending: true,
    saves: 1210,
  },
  {
    id: "d5",
    merchant: "Meso Maya",
    category: "Dining",
    title: "Free guacamole with any entrée",
    description: "House-made guac, no upcharge, all week.",
    distance: "1.6 mi",
    expires: "Ends in 3 days",
    conditions: "One per table. Dine-in only.",
    redeem: "Mention the offer to your server when ordering.",
    personalized: true,
    saves: 310,
  },
  {
    id: "d6",
    merchant: "CVS",
    category: "Services",
    title: "$10 ExtraBucks on $40 spend",
    description: "Rewards back on health and wellness purchases.",
    distance: "0.4 mi",
    expires: "Ends Saturday",
    conditions: "Health and beauty categories only.",
    redeem: "Scan your ExtraCare card before payment.",
    saves: 405,
  },
  {
    id: "d7",
    merchant: "Velvet Taco",
    category: "Dining",
    title: "$3 tacos after 9pm",
    description: "Late-night menu pricing on all signature tacos.",
    distance: "2.1 mi",
    expires: "Ends in 9 days",
    conditions: "In-store only, 9pm to close.",
    redeem: "No code needed · pricing applies automatically.",
    saves: 220,
  },
  {
    id: "d8",
    merchant: "Trader Joe's",
    category: "Grocery",
    title: "Coffee beans $8.99 this week",
    description: "Medium roast 12oz bags marked down store-wide.",
    distance: "1.1 mi",
    expires: "Ends Monday",
    conditions: "While supplies last.",
    redeem: "In-store pricing, nothing to activate.",
    personalized: true,
    saves: 512,
  },
];

export const achievements = [
  { id: "a1", label: "First $50 saved", detail: "Unlocked Aug 12", done: true },
  { id: "a2", label: "10 receipts scanned", detail: "Unlocked Aug 24", done: true },
  { id: "a3", label: "5 deals redeemed", detail: "Unlocked Sep 1", done: true },
  { id: "a4", label: "$250 saved", detail: "$122.60 to go", done: false },
  { id: "a5", label: "30 day streak", detail: "12 days in", done: false },
];

export const scannedReceipt: Receipt = {
  id: "new",
  store: "Whole Foods",
  category: "Grocery",
  date: new Date().toISOString(),
  total: 47.83,
  items: [
    { name: "Rotisserie Chicken", qty: 1, price: 10.99 },
    { name: "Baby Spinach 5oz", qty: 1, price: 4.49 },
    { name: "Sourdough Loaf", qty: 1, price: 5.99 },
    { name: "Almond Butter 16oz", qty: 1, price: 12.99 },
    { name: "Blueberries 1pt", qty: 2, price: 6.19 },
  ],
  savings: [
    {
      id: "n1",
      kind: "cheaper",
      title: "Almond butter is $1.50 cheaper at Target",
      detail: "$11.49 for the same 16oz jar",
      amount: 1.5,
      store: "Target",
      distance: "0.4 mi away",
    },
    {
      id: "n2",
      kind: "missed-deal",
      title: "You qualified for $2 off $15 produce but didn't use it",
      detail: "Save it and we'll remind you at the register next time",
      amount: 2,
      store: "Whole Foods",
    },
    {
      id: "n3",
      kind: "sale",
      title: "Blueberries on sale at Kroger this week",
      detail: "$3.99/pt vs $6.19/pt · save $4.40 on two",
      amount: 4.4,
      store: "Kroger",
      distance: "1.2 mi away",
    },
  ],
};

/* ---------- Added: notifications, streak, badges, referrals, weekly report ---------- */

export const STREAK_DAYS = 12;

export type NotifKind = "deal" | "streak" | "expiring" | "referral" | "report";

export type Notification = {
  id: string;
  kind: NotifKind;
  title: string;
  detail: string;
  time: string;
  group: "Today" | "This Week" | "Earlier";
  dealId?: string;
};

export const notifications: Notification[] = [
  {
    id: "n-1",
    kind: "deal",
    title: "New deal near you",
    detail: "Starbucks · 0.2 mi · $2 off orders over $15",
    time: "12m ago",
    group: "Today",
    dealId: "d3",
  },
  {
    id: "n-2",
    kind: "streak",
    title: `Your savings streak is at ${STREAK_DAYS} days`,
    detail: "Scan today to keep it alive",
    time: "3h ago",
    group: "Today",
  },
  {
    id: "n-3",
    kind: "expiring",
    title: "A deal you saved expires tomorrow",
    detail: "Chipotle · Buy one get one free entrée",
    time: "9h ago",
    group: "Today",
    dealId: "d1",
  },
  {
    id: "n-4",
    kind: "referral",
    title: "Maya joined using your referral",
    detail: "You both earned $5 in savings credit",
    time: "Tue",
    group: "This Week",
  },
  {
    id: "n-5",
    kind: "report",
    title: "Weekly savings report is ready",
    detail: "You found $21.31 across 4 receipts",
    time: "Mon",
    group: "This Week",
  },
  {
    id: "n-6",
    kind: "deal",
    title: "New deal near you",
    detail: "Trader Joe's · 1.1 mi · Coffee beans $8.99",
    time: "Aug 30",
    group: "Earlier",
    dealId: "d8",
  },
  {
    id: "n-7",
    kind: "report",
    title: "Weekly savings report is ready",
    detail: "You found $16.10 across 3 receipts",
    time: "Aug 24",
    group: "Earlier",
  },
];

export type Badge = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  progress?: string;
};

export const badges: Badge[] = [
  { id: "b1", label: "First Scan", detail: "Unlocked Jun 14", done: true },
  { id: "b2", label: "7-Day Streak", detail: "Unlocked Aug 8", done: true },
  { id: "b3", label: "$50 Saved", detail: "Unlocked Aug 12", done: true },
  { id: "b4", label: "$100 Saved", detail: "Unlocked Sep 3", done: true },
  { id: "b5", label: "Deal Hunter", detail: "10 deals used", done: false, progress: "9/10 deals used" },
  {
    id: "b6",
    label: "Receipt Hoarder",
    detail: "50 receipts scanned",
    done: false,
    progress: "23/50 receipts",
  },
  {
    id: "b7",
    label: "Referral King",
    detail: "5 friends invited",
    done: false,
    progress: "3/5 friends invited",
  },
];

// Days of the current month the user scanned (for the streak calendar)
export const scanDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export type Friend = { id: string; name: string; joined: string };

export const friends: Friend[] = [
  { id: "f1", name: "Maya Patel", joined: "Joined Tuesday" },
  { id: "f2", name: "Devon Clark", joined: "Joined Aug 28" },
  { id: "f3", name: "Sofia Ramos", joined: "Joined Aug 19" },
];

export const referralMilestones = [
  { id: "m1", label: "Invite 5 friends", reward: "Unlock Premium deals", have: 3, need: 5 },
  { id: "m2", label: "Invite 10 friends", reward: "Get the exclusive badge", have: 3, need: 10 },
];

export const REFERRAL_CODE = "CALVIN-SIFT";
export const REFERRER_PERCENTILE = 15;

export type ReportCategory = "Dining" | "Grocery" | "Retail" | "Other";

export const weeklyReport = {
  saved: 21.31,
  lastWeekSaved: 17.11,
  days: [
    { day: "Mon", spent: 9.4, category: "Dining" as ReportCategory },
    { day: "Tue", spent: 112.44, category: "Grocery" as ReportCategory },
    { day: "Wed", spent: 0, category: "Other" as ReportCategory },
    { day: "Thu", spent: 23.85, category: "Dining" as ReportCategory },
    { day: "Fri", spent: 64.18, category: "Retail" as ReportCategory },
    { day: "Sat", spent: 18.6, category: "Other" as ReportCategory },
    { day: "Sun", spent: 31.27, category: "Retail" as ReportCategory },
  ],
  breakdown: [
    { category: "Grocery" as ReportCategory, amount: 112.44 },
    { category: "Retail" as ReportCategory, amount: 95.45 },
    { category: "Dining" as ReportCategory, amount: 33.25 },
    { category: "Other" as ReportCategory, amount: 18.6 },
  ],
  missed: [
    {
      id: "mo1",
      store: "Target",
      title: "$5 off $50 Circle offer",
      detail: "Your Friday Target run qualified but the offer never applied",
      amount: 5,
      dealId: "d2",
    },
    {
      id: "mo2",
      store: "Chipotle",
      title: "BOGO entrée on Fridays",
      detail: "Two entrées on Thursday · one day early",
      amount: 11.25,
      dealId: "d1",
    },
    {
      id: "mo3",
      store: "Kroger",
      title: "15% off a full grocery run",
      detail: "Loyalty discount was available on Tuesday's $112 trip",
      amount: 4.5,
      dealId: "d4",
    },
  ],
};

export const reportCategoryColor: Record<ReportCategory, string> = {
  Dining: "var(--chart-1)",
  Grocery: "var(--chart-2)",
  Retail: "var(--chart-3)",
  Other: "var(--chart-4)",
};

export const recentSearches = ["Chipotle", "olive oil", "Target", "coffee"];
export const popularSearches = ["BOGO", "Starbucks", "grocery deals", "Whole Foods"];
