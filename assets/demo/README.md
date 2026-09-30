# Zhara product visuals

The hero is a 15-second muted, looping video (`hero-search.webm`, with `hero-search.mp4` as a fallback, 1080×1080) of the Zhara search overlay as it appears on the live demo store. `hero-search-poster.webp` is the poster frame and also what reduced-motion visitors see. `assets/product-demo.js` plays the video only while it is on screen and the tab is visible, and provides the pause/play button. The page needs no Shopify credentials or API access.

The video renders the widget's real HTML and CSS, captured from the live overlay on zhara-demo.myshopify.com on 2026-09-29, animated frame by frame. It shows three shopper-style queries:

- `shirts for a goa trip`: Casual Shirt: Vintage Greens, Cotton Linen Shirt: Seashell, Textured Shirt: Atlantic, Summer Shirt: Cowboy, Casual Shirt: Birds.
- `comfy stuff to lounge at home`: TSS Originals: Offline, TSS Originals: Let's Chill, Plaid Lounge Pant: Sleepy Sky, TSS Originals: Hearts, Plaid Lounge Pant: Sleepy Sage.
- `something warm for winter`: Heat Tech Jacket: Arctic Blaze, Puffer Jacket: Hearts, Men's Beige Embroidered Oversized Twill Jacket, Polar Fleece Hoodie: Autumn, Men's White Typography Oversized Windcheater Jacket.

Each query shows the widget's first five products, in the order returned. The categories column is hidden to fit the square frame. The composition and render scripts live in the ai-search repo under `brag-output/work/` (`comp.html?fmt=hero`, `render2.cjs`).

## Sources

- App screenshots: the five original PNGs supplied in `screenshots/`. The corresponding `appearance.webp`, `search.webp`, `storefront.webp`, `analytics.webp`, and `overview.webp` files preserve their full content and dimensions, compressed for web delivery.
- Catalog photographs: downloaded from the provided demo storefront on 2026-09-28 and optimized as WebP. Product details and example queries were checked in its Zhara search overlay.
- Autocomplete query `t sh`: selected examples include Men's T Shirt - Pebble (₹899), Women's T Shirt - Galaxy (₹799), Men's T Shirt - Frostee (₹899).
- Query `blue t shirt`: Men's T Shirt - Galaxy (₹899), Women's T Shirt - Dory (₹699), Men's T Shirt - Frostee (₹899) were the first three displayed results. These photos are used in the feature cards.

The current analytics and overview visuals use a consistent illustrative 30-day dataset. The original demo-store captures are retained separately. The screenshot tour supports arrow keys, Home/End, expandable views, Escape to close, and focus restoration. Mobile previews show the complete image without nested scrolling; the full-screen viewer starts fit to width and offers explicit zoom and fit controls.

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
