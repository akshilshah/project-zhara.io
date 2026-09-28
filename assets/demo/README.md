# Zhara product visuals

The hero is an HTML/CSS/JavaScript walkthrough, not a GIF or a live API client. It stays sharp at different sizes and supports scene selection, pause/play, reduced motion, and automatic suspension outside the viewport or in a hidden tab. Its three scenes repeat in about 17 seconds. No Shopify credentials or API access are needed by the marketing page.

Edit the scenes in `assets/product-demo.js`, the initial discovery markup in `index.html`, and the styling in `assets/product-demo.css`.

## Sources

- App screenshots: the five original PNGs supplied in `screenshots/`. The corresponding `appearance.webp`, `search.webp`, `storefront.webp`, `analytics.webp`, and `overview.webp` files preserve their full content and dimensions, compressed for web delivery.
- Catalog photographs: downloaded from the provided demo storefront on 2026-09-28 and optimized as WebP. Product details and example queries were checked in its Zhara search overlay.
- Discovery: Cotton Boxer Shorts - Bananza (₹429, previous ₹599), Modal Stretch Trunks - Opal (₹399, previous ₹599).
- Autocomplete query `t sh`: selected examples include Men's T Shirt - Pebble (₹899), Women's T Shirt - Galaxy (₹799), Men's T Shirt - Frostee (₹899).
- Query `blue t shirt`: Men's T Shirt - Galaxy (₹899), Women's T Shirt - Dory (₹699), Men's T Shirt - Frostee (₹899) were the first three displayed results.

The browser/store wrapper is an editorial presentation of the demo, not an unedited screen recording. “Selected results” means the hero shows only part of the returned list. The current analytics and overview visuals use a consistent illustrative 30-day dataset. The original demo-store captures are retained separately. The screenshot tour supports arrow keys, Home/End, expandable views, Escape to close, and focus restoration. Mobile previews show the complete image without nested scrolling; the full-screen viewer starts fit to width and offers explicit zoom and fit controls.

## Local preview

From the project root: `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/`.

## Illustrative analytics and overview

`analytics-illustrative.webp` and `overview-illustrative.webp` are screenshots rendered from the actual dashboard's presentation functions and CSS, using a local fixture. The header badges have been removed. The footer note and expanded-view title identify the illustrative dataset. The original captures and backend are unchanged.

- Searches: 128,400; sessions: 102,720 (1.25 searches per session, displayed as ~1.3).
- Search funnel: 82,176 clicks (64%), 20,544 cart additions (16%), 6,420 purchases (5% of searches / 6.25% of sessions).
- Search revenue: ₹77,04,000 at an illustrative ₹1,200 per order.
- Total attributed revenue across search, trending products, product recommendations, and no-result recovery: ₹93,60,000 from 7,800 orders.
- Zero-result searches: 1,926 (1.5%); AI-matched searches: 74,472 (58%).
- Daily search/session/order series sum to the headline totals; audience shares and surface revenue reconcile.

Regenerate static source pages and validate the fixture with `node tools/build_analytics_visuals.mjs`. This reads presentation code from the sibling API checkout; it does not start the backend or call its APIs. Capture the two source HTML pages at a 1526px-wide viewport using the browser tool, then encode the PNG captures as lossless WebP. Generated HTML, PNG captures, and the exact fixture are in `assets/demo/source/`.
