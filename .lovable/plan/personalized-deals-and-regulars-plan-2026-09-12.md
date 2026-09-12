# Personalized deals and regulars plan

## Goal
Make every deal and recommendation clearly traceable to the user's receipt history while preserving the current visual system, navigation, and Scan Receipt prominence.

## Changes

### Personalize the Deals experience
- Replace generic popularity language with three purchase-driven sections: **Deals on Your Regulars**, **Smart Swaps**, and **Coming Up Soon**.
- Update the filter row to **All, Groceries, Dining, Household, Personal Care**, backed by the mocked purchase-history categories.
- Extend deal data with relevance reasons, tracked item details, swap comparisons, timing signals, and map positions.
- Show a subtle **Why this deal?** control on every deal card, including saved, home, and related-deal cards, with an inline explanation.
- Limit map pins and list results to relevant deals that match the active category.
- Replace generic deal-detail recommendations with purchase-relevant alternatives and explain why the selected deal appears.

### Add My Regulars
- Create a `/regulars` screen using the current mobile shell, card, typography, spacing, and back-navigation patterns.
- Group tracked products by Grocery, Household, Dining, and Personal Care.
- Show item name, detected brand, average paid price, purchase cadence, and a pause-tracking switch.
- Add lightweight item-entry controls per category and Suggested additions with working Add and Dismiss actions.
- Show the first-visit receipt-learning banner and persist its dismissal and regular-item state with the existing app state.
- Link the screen from Home and Profile without changing the bottom tab structure.

### Update Home and scan results
- Rename **Deals Near You** to **Deals For You** and add a relevance tag to every preview card.
- Insert a **Regular Items Tracked: 24** card between personalized deals and recent scans, linking to My Regulars.
- Add scan-result findings for **Added to your regulars** and a concrete cross-store deal alert showing paid price, current price, and savings.
- Keep saving, confetti, scan-another, and receipt navigation behavior unchanged.

### Update notifications
- Replace generic nearby-deal notices with deal alerts on regular items, restock reminders, and smart-swap findings.
- Route deal alerts and swaps to the matching deal, and restock reminders to My Regulars.
- Preserve grouping, unread indicators, mark-all-read behavior, and existing non-deal notifications.

## Technical details
- Expand the existing mock-data types instead of introducing a new data layer.
- Extend the existing persisted app state for paused regulars, manual additions, suggestion decisions, and banner dismissal.
- Add unique metadata for the new route and update deal/notification metadata to reflect personalized recommendations.
- Use only existing semantic colors, card styles, icons, transitions, and control patterns. No AI-style icons or em dashes.

## Validation
- Verify type safety and route generation.
- Test Home → My Regulars, Profile → My Regulars, filters, map/list, Why this deal explanations, tracking toggles, Add/Dismiss actions, notification routing, deal details, and scan-result saving.
- Check desktop-width preview framing and a mobile viewport for clipping, overlap, and Scan Receipt CTA hierarchy.
