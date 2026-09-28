/** Build static, illustrative analytics views using the product's real renderers.
 * No backend is started, no APIs are called, and no merchant data is modified.
 * node tools/build_analytics_visuals.mjs [path/to/ai-search/api]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const backend = resolve(process.argv[2] || '../ai-search/api');
const admin = `${backend}/src/services/admin`;
const output = resolve('assets/demo/source');
mkdirSync(output, { recursive: true });
const loadExport = (filename, name, injected = {}) => {
  const source = readFileSync(`${admin}/${filename}`, 'utf8').replace(/^import .*$/gm, '').replace(/export const /g, 'const ');
  const context = { ...injected };
  vm.runInNewContext(`${source}\nglobalThis.result = ${name};`, context);
  return context.result;
};
const icons = loadExport('dashboard.icons.js', 'ICONS_JS');
const client = loadExport('dashboard.client.js', 'ADMIN_JS', { ICONS_JS: icons });
const css = loadExport('dashboard.css.js', 'ADMIN_CSS');
const slice = (start, end) => {
  const a = client.indexOf(start), b = client.indexOf(end, a);
  assert(a >= 0 && b > a, `Missing renderer boundary: ${start}`);
  return client.slice(a, b);
};
const renderers = icons + '\n' +
  slice('  // Every icon in the app', '  // ---- page scaffolding') +
  slice('  var SURFACE_COLORS', '  // ---- ANALYTICS') +
  slice('  function anaPerformance(', '  // ---- Analytics · Queries');

// One consistent 30-day example. Rates derive from counts, not independent placeholders.
const searches = 128400, sessions = 102720, clicked = 82176, carts = 20544, purchases = 6420;
const zeros = 1926, semantic = 74472, averageOrderValue = 1200;
const percent = (part, total) => Math.round(part / total * 10000) / 100;
const surfaceOrders = [6420, 600, 550, 230];
const revenue = surfaceOrders.reduce((sum, n) => sum + n * averageOrderValue, 0);
const distribute = (total, weights) => {
  const sum = weights.reduce((a, b) => a + b, 0);
  const result = weights.map(w => Math.floor(total * w / sum));
  let remaining = total - result.reduce((a, b) => a + b, 0);
  for (let i = 0; remaining > 0; i++, remaining--) result[i % result.length]++;
  return result;
};
const weights = [78,84,81,91,86,74,80,90,99,96,105,101,89,95,109,113,107,120,117,103,109,121,127,119,130,126,116,128,138,145];
const dailySearches = distribute(searches, weights);
const dailySessions = distribute(sessions, weights);
const dailyOrders = distribute(purchases, weights.map((w, i) => w * (.84 + i * .011)));
const dailyZeros = distribute(zeros, weights.map((w, i) => w * (1.4 - i * .023)));
const series = counts => counts.map((count, i) => ({ date: new Date(Date.UTC(2026, 7, 30 + i)).toISOString().slice(0, 10), count }));
const data = {
  illustrative: true, days: 30, hasPrev: true, pixelConnected: true,
  totals: { searches, sessions, ctr: percent(clicked, searches), avgResults: 18.4, semanticRate: percent(semantic, searches),
    searchToPurchase: percent(purchases, sessions), zeroRate: percent(zeros, searches), currency: 'INR' },
  deltas: { searches: searches - 110000, sessions: sessions - 88000, searchToPurchase: .75, zeroRate: -.9, avgResults: 2.1, semanticRate: 7, revenuePct: (revenue / 8000000 - 1) * 100 },
  hero: { currency: 'INR', revenue, orders: 7800, revenueShare: 40,
    bySurface: ['search_bar','trending_carousel','pdp_reco','no_result_recovery'].map((key, i) => ({ key,
      label: ['Search bar','Trending products','Product recommendations','No-result recovery'][i], orders: surfaceOrders[i], revenue: surfaceOrders[i] * averageOrderValue })) },
  funnel: [ { label: 'Searches', value: searches }, { label: 'Clicked a result', value: clicked },
    { label: 'Added to cart', value: carts, pixel: true }, { label: 'Purchased', value: purchases, pixel: true } ],
  series: { searches: series(dailySearches), sessions: series(dailySessions), orders: series(dailyOrders),
    searchToPurchase: series(dailyOrders.map((n, i) => n / dailySessions[i] * 100)),
    zeroRate: series(dailyZeros.map((n, i) => n / dailySearches[i] * 100)) },
  topQueries: [ ['blue t shirt',18420],['cotton boxers',14980],['everyday comfort',12640],['t shirt',10320],['women t shirt',8920],['multi-pack',7610] ].map(([query,count]) => ({query,count})),
  zeroQueries: [ ['thermal vest',680],['bamboo socks',520],['oversized hoodie',426],['linen shorts',300] ].map(([query,count]) => ({query,count})),
  topProducts: [ ['Men’s T Shirt – Galaxy','galaxy',12000,8],['Women’s T Shirt – Dory','dory',10000,7.5],['Men’s T Shirt – Frostee','frostee',8000,8],['Men’s T Shirt – Pebble','pebble',6000,7] ].map(([title,image,clicks,cvr]) => ({title,featuredImage:`/assets/demo/${image}.webp`,clicks,cvr})),
  audience: {
    shopperType: [{ label: 'Signed in', value: 35952 },{ label: 'Guest', value: 66768 }],
    newVsReturning: [{ label: 'New shoppers', value: 63686 },{ label: 'Returning', value: 39034 }],
    device: [{ label: 'Mobile', value: 71904 },{ label: 'Desktop', value: 26707 },{ label: 'Tablet', value: 4109 }]
  }
};
data.deltas.revenuePct = Math.round(data.deltas.revenuePct * 10) / 10;
const health = { catalog: {status:'Synced', ok:true, indexed:862, productCount:862, failedToIndex:0},
  search: {latencyMs:42,status:'Operational',ok:true}, tracking:{status:'Active · receiving events',receiving:true,activated:true} };
assert.equal(dailySearches.reduce((a,b)=>a+b), searches);
assert.equal(dailySessions.reduce((a,b)=>a+b), sessions);
assert.equal(dailyOrders.reduce((a,b)=>a+b), purchases);
assert.equal(dailyZeros.reduce((a,b)=>a+b), zeros);
assert.equal(data.zeroQueries.reduce((a,b)=>a+b.count,0), zeros);
assert.equal(data.hero.bySurface.reduce((a,b)=>a+b.revenue,0), revenue);
assert.equal(data.hero.bySurface.reduce((a,b)=>a+b.orders,0), data.hero.orders);
for (const mix of Object.values(data.audience)) assert.equal(mix.reduce((a,b)=>a+b.value,0), sessions);
for (let i=1;i<data.funnel.length;i++) assert(data.funnel[i].value <= data.funnel[i-1].value);
const context = {a:data,hl:health};
vm.runInNewContext(renderers + `\nglobalThis.overview = heroCard(a) + statTiles(a) + '<div class="za-split">' + activityCard(a) + insightsCard(a, hl) + '</div><div class="za-pair">' + topSearchesCard(a.topQueries) + needsAttentionCard(a.zeroQueries) + '</div>' + healthStrip(hl);\nglobalThis.analytics = anaPerformance(a);`, context);
const shell = `
*{box-sizing:border-box}body{position:relative;margin:0;background:#f1f1f1;color:#1a1a1a;font-family:Arial,sans-serif;font-size:14px}button{font-family:inherit} .chrome{height:56px;background:#101010;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 22px}.shopify svg{width:23px;height:27px;vertical-align:middle;margin-right:5px}.shopify{font-size:23px;font-weight:700;font-style:italic;letter-spacing:-1px}.search{width:630px;height:35px;display:flex;align-items:center;padding:0 14px;border:1px solid #454545;border-radius:11px;background:#292929;color:#b6b6b6;font-size:13px}.search span{margin-left:auto}.store{font-size:12px;display:flex;align-items:center;gap:8px}.avatar{border-radius:8px;background:#45e994;color:#175f35;padding:9px 5px;font-size:9px;font-weight:700}.dev{border-radius:8px;padding:3px 6px;color:#9d9d9d;background:#303030}.sidebar{position:absolute;top:56px;left:0;width:240px;bottom:0;min-height:calc(100vh - 56px);background:#ebebeb;padding:15px 12px;color:#494949}.navline{display:flex;align-items:center;gap:10px;height:29px;font-size:12px;font-weight:600;padding:0 8px}.navline svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.7}.navlabel{font-size:11px;font-weight:600;margin:21px 8px 8px}.appnav{font-size:12px;line-height:29px;padding-left:35px}.appnav.active{background:#fff9;border-radius:8px;font-weight:600}.appname{padding:0 8px;display:flex;gap:9px;align-items:center;font-size:12px;font-weight:600;height:29px}.appname img{width:15px;height:15px}.page-title{height:57px;border-bottom:1px solid #e8e8e8;margin-left:240px;display:flex;align-items:center;padding:0 22px;gap:11px;font-size:18px;font-weight:600}.page-title img{width:22px;height:22px;background:#fff;padding:4px;border-radius:5px}.workspace{margin-left:240px;padding:25px 28px 24px}.surface{max-width:966px;margin:0 auto}.za{--font:Arial,sans-serif}.za-actions{display:flex;gap:12px;justify-content:flex-start}.za-fn{gap:28px}.za-hero-n{min-height:48px}.footer-note{font-size:10px;color:#888;text-align:right;margin-top:15px}.za-prow .za-thumb img{object-position:top}
`;
const navIcons={Home:'<path d="m3 11 9-8 9 8v10H3z"/><path d="M9 21v-7h6v7"/>',Orders:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 5V3h8v2M8 11h8M8 15h6"/>',Products:'<path d="M3 3h9l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1"/>',Customers:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',Marketing:'<path d="m3 9 15-5v16L3 15zM5 15l2 6"/>',Discounts:'<circle cx="12" cy="12" r="9"/><path d="m8 16 8-8M8 8h.1M16 16h.1"/>',Content:'<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',Markets:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 0 0 18 18 18 0 0 0 0-18"/>',Analytics:'<path d="M4 21V10M10 21V3M16 21V7M22 21V14"/>'};
function page(name,body){
  const nav=Object.entries(navIcons).map(([label,icon])=>`<div class="navline"><svg viewBox="0 0 24 24">${icon}</svg>${label}</div>`).join('');
  const apps=['Overview','Analytics','Recommendations','Merchandising','Search','Appearance','Storefront'];
  const tabs=name==='Analytics'?'<div class="za-tabs"><button class="za-tab on">Performance</button><button class="za-tab">Queries</button><button class="za-tab">Products</button><button class="za-tab">System health</button></div><div class="za-actions" style="margin-bottom:20px"><button class="za-fpill">7 days</button><button class="za-fpill on">30 days</button><button class="za-fpill">90 days</button><button class="za-fpill">Custom</button></div>':'';
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zhara ${name} — illustrative data</title><style>${css}\n${shell}</style></head><body><div class="chrome"><span class="shopify"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M4 7 19 4l4 23L1 25z" fill="#fff"/><path d="M7 7C6-1 16-2 16 6" fill="none" stroke="#fff" stroke-width="2"/><text x="7" y="21" font-family="Arial" font-weight="700" font-size="17" fill="#101010">S</text></svg>shopify</span><div class="search">⌕ Search<span>⌘ K</span></div><div class="store"><span class="avatar">ZHA</span>zhara-demo<span class="dev">dev</span></div></div><aside class="sidebar">${nav}<div class="navlabel">Sales channels</div><div class="navline">▣ &nbsp; Online Store</div><div class="navlabel">Apps</div><div class="appname"><img src="/assets/logo/zhara-mark.svg" alt="">Zhara AI Search &amp; Discovery</div>${apps.map(n=>`<div class="appnav ${n===name?'active':''}">${n}</div>`).join('')}</aside><div class="page-title"><img src="/assets/logo/zhara-mark.svg" alt="">${name}</div><main class="workspace"><div class="surface"><div class="za">${tabs}${body}</div><div class="footer-note">Illustrative 30-day dataset · Aug 30 – Sep 28, 2026</div></div></main></body></html>`;
}
for (const name of ['analytics','overview']) writeFileSync(`${output}/${name}-illustrative.html`, page(name==='analytics'?'Analytics':'Overview',context[name]));
writeFileSync(`${output}/analytics-data.json`,JSON.stringify({data,health},null,2)+'\n');
console.log(JSON.stringify({searches,sessions,clicks:clicked,carts,purchases,searchRevenue:purchases*averageOrderValue,attributedRevenue:revenue,attributedOrders:data.hero.orders,zeroResultRate:data.totals.zeroRate,searchToPurchase:data.totals.searchToPurchase},null,2));
