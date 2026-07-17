const fs = require('fs');
const path = require('path');

const content = JSON.parse(fs.readFileSync('public/content.json', 'utf-8'));
const c = content;

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function pillarCard(p, i) {
  const icons = ['📉','🏨','🏗️','✈️'];
  return `<div class="pillar-card">
    <div class="pillar-icon">${icons[i]}</div>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.stat)}</p>
  </div>`;
}

function marketTable() {
  const m = c.market_snapshot.housing;
  const rows = [
    ['Median Sale Price (all homes)', m.median_sale_price],
    ['YoY Price Trend', m.median_price_trend],
    ['Single-Family Median', m.single_family_median],
    ['Condo Median', m.condo_median],
    ['Price per Sq Ft (market)', m.price_per_sqft_market],
    ['Active Listings', m.active_listings],
    ['Vacant Lots Listed', m.vacant_lots_listed.toString()],
    ['Median Lot Price', m.median_lot_price],
    ['Gulf-Front Lot Range', m.gulf_front_lot_range],
    ['Months of Supply', m.months_of_supply],
    ['Days on Market', m.days_on_market],
    ['Sales Below List Price', m.sales_below_list_pct],
    ['Condo Cash Sales', m.condo_cash_sales_pct],
  ];
  return rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
}

function rebuildItems(items) {
  return items.map(i => `<li>${typeof i === 'string' ? esc(i) : esc(i.project+' — '+i.detail)}</li>`).join('');
}

function rebuildList(items) {
  return items.map(i => `<li class="check">${esc(i)}</li>`).join('');
}

function galleryPages() {
  let html = '';
  for (let i = 1; i <= 11; i++) {
    const n = String(i).padStart(2, '0');
    html += `<div class="gallery-page"><img src="assets/prospectus-pages/page-${n}.png" alt="Prospectus page ${i}" loading="lazy"></div>`;
  }
  return html;
}

const site = c.site;
const thesis = c.core_thesis;
const mkt = c.market_snapshot;
const island = c.island_rebuild;
const regional = c.regional_engine;
const ladder = c.investment_ladder;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(site.name + ' — ' + site.tagline)}</title>
<meta name="description" content="Fort Myers Beach 2026: prices down, hotel supply 41% below pre-Ian, weekly rentals legal Gulf-side. The dual-use beach investment, explained with data.">
<meta property="og:title" content="${esc('Fort Myers Beach Real Estate Investment — Own the Beach, Rent It When You\'re Away')}">
<meta property="og:description" content="Fort Myers Beach 2026: prices down, hotel supply 41% below pre-Ian, weekly rentals legal Gulf-side. The dual-use beach investment, explained with data.">
<meta property="og:image" content="assets/photos/01-hero-beach-aerial.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://fortmyersbeachinsider.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0F172A;background:#FEFCF8;line-height:1.6}
h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:#284851;margin-bottom:1rem;letter-spacing:-0.02em}
h3{font-size:1.25rem;font-weight:700;color:#284851}
section{padding:5rem 1.5rem;max-width:1200px;margin:0 auto}
.section-label{font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#009EB7;margin-bottom:0.75rem}
hr{width:60px;height:3px;background:#009EB7;border:none;margin:1rem 0 2rem}
small.data-note{display:block;color:#64748B;font-size:0.75rem;margin-top:0.5rem}

/* Nav */
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #E2E8F0;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between}
nav .logo{font-weight:800;font-size:1.1rem;color:#284851;display:flex;align-items:center;gap:0.5rem}
nav .logo span{color:#009EB7}
nav .nav-links{display:flex;gap:1.5rem;font-size:0.85rem;font-weight:500}
nav .nav-links a{color:#475569;text-decoration:none;transition:color 0.2s}
nav .nav-links a:hover{color:#009EB7}

/* Hero */
.hero{min-height:100vh;display:flex;align-items:center;position:relative;background:linear-gradient(135deg, #284851 0%, #335D68 40%, #009EB7 100%);color:#fff;padding:7rem 1.5rem 5rem}
.hero::before{content:'';position:absolute;inset:0;background:url('assets/photos/01-hero-beach-aerial.png') center/cover;opacity:0.15}
.hero-content{position:relative;max-width:800px;margin:0 auto;text-align:center}
.hero h1{font-size:clamp(2.2rem,6vw,4rem);font-weight:800;line-height:1.15;margin-bottom:1.25rem}
.hero p.sub{font-size:1.15rem;opacity:0.9;max-width:600px;margin:0 auto 2rem;line-height:1.7}
.btn{display:inline-block;padding:0.9rem 2rem;border-radius:8px;font-weight:600;font-size:1rem;text-decoration:none;transition:all 0.2s;cursor:pointer;border:none}
.btn-primary{background:#fff;color:#284851}
.btn-primary:hover{background:#E2E8F0;transform:translateY(-1px)}
.btn-outline{background:transparent;border:2px solid rgba(255,255,255,0.3);color:#fff;margin-left:0.75rem}
.btn-outline:hover{background:rgba(255,255,255,0.1)}
.btn-teal{background:#009EB7;color:#fff}
.btn-teal:hover{background:#008DA5}

/* Pillars */
.pillar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-top:2rem}
.pillar-card{background:#fff;border-radius:12px;padding:2rem;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:transform 0.2s}
.pillar-card:hover{transform:translateY(-3px)}
.pillar-icon{font-size:2rem;margin-bottom:0.75rem}
.pillar-card h3{font-size:1.1rem;margin-bottom:0.5rem}
.pillar-card p{color:#475569;font-size:0.95rem}

/* Dual-Use Math */
.dual-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;margin-top:2rem}
.dual-card{background:#fff;border-radius:12px;padding:2rem;border:1px solid #E2E8F0}
.dual-card h3{color:#009EB7;margin-bottom:1rem}
.stat-row{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #F1F5F9;font-size:0.95rem}
.stat-row .val{font-weight:700;color:#284851}
.dual-highlight{background:linear-gradient(135deg,rgba(40,72,81,0.85),rgba(51,93,104,0.85)),url('assets/photos/02-dual-use-beach-house.png') center/cover;color:#fff;border-radius:12px;padding:2rem;text-align:center}
.dual-highlight .big{font-size:clamp(2rem,5vw,3rem);font-weight:800;display:block}
.dual-highlight .sub{opacity:0.8;font-size:0.95rem;margin-top:0.5rem}

/* Rebuild */
.rebuild-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:2rem}
.rebuild-card{background:#fff;border-radius:12px;padding:1.75rem;border:1px solid #E2E8F0}
.rebuild-card h3{color:#009EB7;margin-bottom:0.75rem;font-size:1rem}
.rebuild-card ul{list-style:none;font-size:0.9rem;color:#475569}
.rebuild-card ul li{padding:0.35rem 0;padding-left:1.25rem;position:relative}
.rebuild-card ul li::before{content:'•';position:absolute;left:0;color:#009EB7;font-weight:700}
.rebuild-card ul li.check::before{content:'✓';color:#0C683D;font-weight:700}

/* Market Table */
.market-table{width:100%;border-collapse:collapse;margin-top:1.5rem;font-size:0.95rem}
.market-table td{padding:0.75rem 1rem;border-bottom:1px solid #F1F5F9}
.market-table tr td:first-child{color:#475569}
.market-table tr td:last-child{font-weight:600;color:#284851;text-align:right}
.market-table thead td{font-weight:700;color:#009EB7;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em}
.market-note{background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:1.25rem;margin-top:1.5rem;font-size:0.9rem;color:#9A3412}
.market-note strong{color:#7C2D12}

/* Regional */
.regional-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:2rem}
.regional-card{background:#fff;border-radius:12px;padding:2rem;border:1px solid #E2E8F0;border-top:4px solid #009EB7}
.regional-card h3{color:#284851;margin-bottom:0.75rem}
.regional-card p,.regional-card li{color:#475569;font-size:0.9rem}

/* Ladder */
.ladder-table{width:100%;border-collapse:collapse;margin-top:1.5rem;font-size:0.95rem}
.ladder-table th{text-align:left;padding:0.75rem 1rem;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;color:#009EB7;border-bottom:2px solid #E2E8F0}
.ladder-table td{padding:0.75rem 1rem;border-bottom:1px solid #F1F5F9;vertical-align:top}
.ladder-table td:first-child{font-weight:600;color:#284851}
.ladder-table td:nth-child(2){color:#009EB7;font-weight:600}
.ladder-table td:last-child{color:#475569;font-size:0.85rem}
.ladder-best{border-left:4px solid #0C683D;background:#F0FAF8}

/* Gallery */
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-top:2rem}
.gallery-page{border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s;cursor:pointer}
.gallery-page:hover{transform:scale(1.03)}
.gallery-page img{width:100%;height:auto;display:block}

/* Risks */
.risks-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;margin-top:1.5rem}
.risk-card{background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:1.25rem;font-size:0.9rem}
.risk-card .icon{font-size:1.5rem;margin-bottom:0.5rem}
.risk-card h4{font-size:0.95rem;margin-bottom:0.35rem;color:#284851}
.risk-card p{color:#64748B}

/* Lead */
.lead-section{background:linear-gradient(135deg,rgba(40,72,81,0.88),rgba(0,158,183,0.82)),url('assets/photos/08-cta-sunset-dunes.png') center/cover;color:#fff;border-radius:16px;padding:3rem;text-align:center;margin-top:0}
.lead-section h2{color:#fff}
.lead-section p{opacity:0.85;margin-bottom:1.5rem;max-width:500px;margin-left:auto;margin-right:auto}
.lead-form{display:flex;gap:0.75rem;max-width:450px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.lead-form input{flex:1;min-width:200px;padding:0.8rem 1rem;border-radius:8px;border:none;font-size:0.95rem;font-family:inherit}
.lead-form input:focus{outline:3px solid #009EB7}
.lead-form button{padding:0.8rem 1.5rem}
.lead-status{font-size:0.85rem;margin-top:0.75rem;min-height:1.5em}

/* Footer */
footer{background:#284851;color:#E2E8F0;padding:3rem 1.5rem;font-size:0.85rem}
.footer-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem}
.footer-grid h4{color:#fff;font-size:0.9rem;margin-bottom:0.75rem}
.footer-grid a{color:#94A3B8;text-decoration:none;display:block;padding:0.2rem 0}
.footer-grid a:hover{color:#009EB7}
.footer-bottom{border-top:1px solid #284851;margin-top:2rem;padding-top:1.5rem;text-align:center;color:#64748B;font-size:0.8rem;max-width:1200px;margin-left:auto;margin-right:auto}

/* Mobile */
@media(max-width:768px){
  nav .nav-links{display:none}
  section{padding:3rem 1rem}
  .hero{padding:5rem 1rem 3rem}
  .btn-outline{margin-left:0;margin-top:0.5rem}
  .market-table td{font-size:0.8rem;padding:0.5rem 0.75rem}
  .lead-form{flex-direction:column}
}
</style>
</head>
<body>

<nav>
  <div class="logo">🏖️ <span>Fort Myers Beach</span> Insider</div>
  <div class="nav-links">
    <a href="#opportunity">Opportunity</a>
    <a href="#dual-use">Dual-Use Math</a>
    <a href="#island">The Island</a>
    <a href="#market">Market</a>
    <a href="#regional">Region</a>
    <a href="#ladder">Ways In</a>
    <a href="#prospectus">Prospectus</a>
    <a href="#risks">Risks</a>
  </div>
</nav>

<section class="hero" id="home">
  <div class="hero-content">
    <h1>${esc(site.tagline)}</h1>
    <p class="sub">${esc(thesis.one_liner)}</p>
    <a href="#prospectus" class="btn btn-primary">Get the 2026 Prospectus</a>
    <a href="#dual-use" class="btn btn-outline">See the Math</a>
  </div>
</section>

<section id="opportunity">
  <span class="section-label">The Opportunity</span>
  <h2>Why Fort Myers Beach in 2026</h2>
  <hr>
  <p style="font-size:1.1rem;max-width:700px;color:#475569;margin-bottom:1.5rem">${esc(thesis.dual_use_pitch)}</p>
  <div class="pillar-grid">
    ${thesis.pillars.map(pillarCard).join('')}
  </div>
  <small class="data-note">Data as of July 2026</small>
</section>

<section id="dual-use" style="background:#F8FAFC">
  <span class="section-label">Dual-Use Math</span>
  <h2>Use It. Rent It. Both Work.</h2>
  <hr>
  <p style="font-size:1.05rem;color:#475569;max-width:650px">Weekly rentals are legal by right in the Gulf-side zone — block your own weeks, rent the rest. The numbers hold up.</p>
  <div class="dual-grid">
    <div class="dual-card">
      <h3>Rental Performance</h3>
      <div class="stat-row"><span>Average Daily Rate</span><span class="val">${esc(mkt.rentals.str_adr)}</span></div>
      <div class="stat-row"><span>Occupancy Range</span><span class="val">${esc(mkt.rentals.str_occupancy)}</span></div>
      <div class="stat-row"><span>Avg Listing Gross</span><span class="val">${esc(mkt.rentals.avg_listing_gross_annual)}</span></div>
      <div class="stat-row"><span>Large 5-6BR Homes</span><span class="val">${esc(mkt.rentals.large_home_gross_annual)}</span></div>
      <div class="stat-row"><span>Gross Yields</span><span class="val">${esc(mkt.rentals.gross_yields)}</span></div>
      <div class="stat-row"><span>Registration</span><span class="val">${esc(mkt.rentals.rules)}</span></div>
    </div>
    <div class="dual-highlight">
      <span class="big">${esc(mkt.rentals.large_home_gross_annual)}</span>
      <span class="sub">Annual gross for new elevated 5-6BR homes in the weekly-rental zone</span>
    </div>
  </div>
  <small class="data-note">Data as of July 2026 · Sources: AirDNA, AirROI, Rabbu, Airbtics</small>
</section>

<section id="island" style="position:relative">
  <div style="position:absolute;inset:0;background:url('assets/photos/03-island-rebuilt-pier.png') center/cover;opacity:0.08;pointer-events:none"></div>
  <div style="position:relative;z-index:1">
  <span class="section-label">The Island Is Back</span>
  <h2>Rebuilt, Reopened, and Running</h2>
  <hr>
  <div class="rebuild-grid">
    <div class="rebuild-card">
      <h3>🏖️ Beach & Infrastructure</h3>
      <ul>${rebuildList([island.beach, ...island.infrastructure.slice(0,5)])}</ul>
    </div>
    <div class="rebuild-card">
      <h3>🏗️ Development Pipeline</h3>
      <ul>${rebuildItems(island.development_pipeline)}</ul>
    </div>
    <div class="rebuild-card">
      <h3>🌴 Lifestyle</h3>
      <ul>${rebuildList([island.dining, ...island.parks])}</ul>
    </div>
    <div class="rebuild-card">
      <h3>🎉 Annual Events</h3>
      <ul>${rebuildList(island.events)}</ul>
    </div>
  </div>
  <div style="margin-top:2rem;border-radius:12px;overflow:hidden"><img src="assets/photos/04-lifestyle-dining.png" alt="Waterfront tiki dining at golden hour — illustrative of 40+ restaurants on Fort Myers Beach" style="width:100%;display:block"></div>
  <small class="data-note">Data as of July 2026</small>
  </div>
</section>

<section id="market" style="background:#F8FAFC">
  <div style="float:right;width:40%;margin:0 0 1.5rem 2rem;border-radius:12px;overflow:hidden"><img src="assets/photos/05-new-construction-homes.png" alt="Street of new elevated piling homes on Fort Myers Beach" style="width:100%;display:block"></div>
  <span class="section-label">Market Snapshot</span>
  <h2>The 2026 Entry Window</h2>
  <hr>
  <p style="font-size:1.05rem;color:#475569;max-width:650px;margin-bottom:1.5rem">Prices are down 9–18%, 95% of sales close below list, and supply sits at 11–13 months — rare conditions on a supply-constrained island. Realtor.com forecasts the metro down 10.2% for 2026, the steepest in the U.S.</p>
  <table class="market-table">
    <thead><tr><td>Metric</td><td>Value</td></tr></thead>
    <tbody>${marketTable()}</tbody>
  </table>
  <div class="market-note">
    <strong>⚠ Condo Note:</strong> ${esc(mkt.housing.condo_risks)}<br><br>
    <strong>🏠 Insurance:</strong> ${esc(mkt.housing.insurance_note)}
  </div>
  <small class="data-note">Data as of mid-2026 · Sources: Zillow, Houzeo, Homes.com, RealtyTrac, Lee County</small>
</section>

<section id="regional">
  <span class="section-label">Regional Engine</span>
  <h2>Growth That Doesn't Depend on the Beach Alone</h2>
  <hr>
  <div class="regional-grid">
    <div class="regional-card">
      <img src="assets/photos/06-rsw-airport-terminal.png" alt="Bright modern airport concourse — illustrative of RSW $1.7B expansion" style="width:100%;border-radius:8px;margin-bottom:1rem">
      <h3>✈️ RSW Airport — $1.7B Expansion</h3>
      <p>${esc(regional.rsw_airport.program)}</p>
      <ul style="margin-top:0.75rem">
        <li>${esc(regional.rsw_airport.concourse_e)}</li>
        <li>${esc(regional.rsw_airport.traffic)}</li>
        <li>${esc(regional.rsw_airport.status_rank)}</li>
        <li>${esc(regional.rsw_airport.impact)}</li>
      </ul>
    </div>
    <div class="regional-card">
      <h3>📈 Lee County — America's Growth Leader</h3>
      <p>${esc(regional.lee_county.population)}</p>
      <ul style="margin-top:0.75rem">
        <li>${esc(regional.lee_county.babcock_ranch)}</li>
        <li>${esc(regional.lee_county.lee_health)}</li>
        <li>${esc(regional.lee_county.roads_2026)}</li>
      </ul>
    </div>
    <div class="regional-card">
      <img src="assets/photos/07-downtown-riverfront.png" alt="River District marina and towers at dusk — illustrative of downtown Fort Myers $6B redevelopment" style="width:100%;border-radius:8px;margin-bottom:1rem">
      <h3>🏙️ Downtown Fort Myers — $6B Redevelopment</h3>
      <p>${esc(regional.downtown_fort_myers.master_plan)}</p>
      <ul style="margin-top:0.75rem">
        <li>${esc(regional.downtown_fort_myers.news_press_site)}</li>
        <li>${esc(regional.downtown_fort_myers.yacht_basin)}</li>
        <li>${esc(regional.downtown_fort_myers.delivered)}</li>
      </ul>
    </div>
  </div>
  <small class="data-note">Data as of July 2026</small>
</section>

<section id="ladder" style="background:#F8FAFC">
  <span class="section-label">Ways In</span>
  <h2>The Investment Ladder</h2>
  <hr>
  <p style="font-size:1.05rem;color:#475569;max-width:650px;margin-bottom:1.5rem">Every rung has trade-offs. Know them before you step on.</p>
  <table class="ladder-table">
    <thead><tr><th>Entry Point</th><th>Price</th><th>What to Know</th></tr></thead>
    <tbody>
${ladder.map((r,i) => `<tr${i===ladder.length-1?' class="ladder-best"':''}><td>${esc(r.entry)}</td><td>${esc(r.price)}</td><td>${esc(r.note)}</td></tr>`).join('')}
    </tbody>
  </table>
</section>

<section id="prospectus">
  <span class="section-label">The Prospectus</span>
  <h2>The Full Story in 11 Pages</h2>
  <hr>
  <p style="font-size:1.05rem;color:#475569;margin-bottom:1.5rem">Download the complete 2026 Fort Myers Beach Investment Prospectus — every chart, stat, and source in one document.</p>
  <a href="docs/Fort Myers Beach - 2026 Investment Prospectus.pdf" class="btn btn-teal" style="margin-bottom:2rem" download>📥 Download the Full Prospectus (PDF)</a>
  <div class="gallery">
    ${galleryPages()}
  </div>
</section>

<section id="risks">
  <span class="section-label">Risks, Stated Plainly</span>
  <h2>What Could Go Wrong</h2>
  <hr>
  <p style="font-size:1.05rem;color:#475569;max-width:650px;margin-bottom:1.5rem">Honest disclosure builds trust. Here's what we're watching.</p>
  <div class="risks-grid">
    <div class="risk-card"><div class="icon">🌪️</div><h4>Hurricane Exposure</h4><p>Fort Myers Beach is a barrier island in an active storm basin. Ian (2022) was a direct hit. Recurrence is not a question of if but when.</p></div>
    <div class="risk-card"><div class="icon">💰</div><h4>Insurance Volatility</h4><p>Property insurance in Florida remains expensive and unpredictable. Legacy homes in VE flood zones face $5K–$20K+/yr premiums. Markets can shift rapidly.</p></div>
    <div class="risk-card"><div class="icon">🏗️</div><h4>Project & Permit Uncertainty</h4><p>The $17.7M pier is scheduled for 2027–28 completion — timing may slip. Some approved projects (Seagate/Red Coconut) had sites listed for sale in 2026. Not every announced project gets built.</p></div>
    <div class="risk-card"><div class="icon">📉</div><h4>Market Downturn Risk</h4><p>The -10.2% 2026 metro forecast is a buyer's advantage today — but if the national economy softens further, vacation-home demand could erode, pressuring STR income and resale values.</p></div>
  </div>
</section>

<section class="lead-section">
  <h2>Get the Prospectus + Market Updates</h2>
  <p>One email. The full prospectus PDF, plus occasional market updates — no spam, unsubscribe anytime.</p>
  <form class="lead-form" id="lead-form" onsubmit="return handleSubmit(event)">
    <input type="email" id="email" placeholder="Your email address" required>
    <button type="submit" class="btn btn-primary">Send It</button>
  </form>
  <div class="lead-status" id="lead-status"></div>
</section>

<footer>
  <div class="footer-grid">
    <div>
      <h4>Fort Myers Beach Insider</h4>
      <p style="color:#94A3B8">Data-driven beach property investment research for Southwest Florida. Prepared ${esc(site.prepared)}.</p>
    </div>
    <div>
      <h4>Resources</h4>
      <a href="docs/Fort Myers Beach - 2026 Investment Prospectus.pdf" download>Download Prospectus (PDF)</a>
      <a href="docs/FMB_Research_Appendix_July2026.md">Research Appendix</a>
      <a href="BUILD_BRIEF.md">Build Brief</a>
    </div>
    <div>
      <h4>Data Sources</h4>
      ${c.sources.map(s => `<span style="display:block;color:#94A3B8;padding:0.15rem 0;font-size:0.8rem">${esc(s)}</span>`).join('')}
    </div>
  </div>
  <div class="footer-bottom">
    <p><strong>${esc(site.disclaimer)}</strong></p>
    <p style="margin-top:0.5rem">© 2026 Fort Myers Beach Insider. All rights reserved.</p>
  </div>
</footer>

<script>
async function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const status = document.getElementById('lead-status');
  status.textContent = 'Submitting…';
  try {
    const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    const r = await fetch(supabaseUrl + '/rest/v1/leads', {
      method: 'POST',
      headers: {'Content-Type':'application/json','apikey':supabaseKey,'Authorization':'Bearer '+supabaseKey},
      body: JSON.stringify({email, source:'website', created_at: new Date().toISOString()})
    });
    if (r.ok || r.status === 201) {
      status.textContent = '✓ Got it! Check your inbox for the prospectus.';
      document.getElementById('email').value = '';
    } else {
      status.textContent = 'Something went wrong. Please email us directly.';
    }
  } catch(e) {
    status.textContent = 'Unable to connect. Please try again.';
  }
}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"${esc(site.name)}","url":"https://fortmyersbeachinsider.com","description":"${esc(site.tagline)}","publisher":{"@type":"Organization","name":"Fort Myers Beach Insider"}}
</script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', html);
fs.writeFileSync('index.html', html);
console.log('✓ Built index.html (' + (html.length / 1024).toFixed(0) + ' KB)');
