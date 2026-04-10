/* Okashi — Brand Page Renderer */

function renderBrandPage(brand) {
  const main = document.getElementById('brand-main');

  // Discovery section
  const discoveriesHtml = brand.discoveries.map(d =>
    `<div class="discovery-item">
      <div class="discovery-text">${d}</div>
    </div>`
  ).join('');

  // Scene suggestions
  const scenesHtml = brand.scenes.map(s =>
    `<div class="scene-item">
      <span class="scene-when">${s.when}</span>
      <span class="scene-arrow">→</span>
      <span class="scene-what">${s.what}</span>
    </div>`
  ).join('');

  // Real voices
  const voicesHtml = (brand.realVoices || []).map(v =>
    `<div class="voice-item">
      <div class="voice-quote">"${v.quote}"</div>
      <div class="voice-meta">
        <span class="voice-user">u/${v.user}</span>
        <span class="voice-source">${v.source}</span>
        ${v.score ? `<span class="voice-score">${v.score} pts</span>` : ''}
      </div>
    </div>`
  ).join('');

  // Related articles
  const articlesHtml = brand.articles.map(a =>
    `<a href="${a.url}" class="brand-article-link">${a.icon} ${a.title}</a>`
  ).join('');

  main.innerHTML = `
    <section class="brand-hero">
      <div class="container">
        <p class="brand-lead">${brand.lead}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">Things you probably didn't know</h2>
        <div class="discovery-grid">${discoveriesHtml}</div>
      </div>
    </section>

    <section class="section" style="background:#fff">
      <div class="container">
        <h2 class="section-title">The snacks</h2>
        <div class="card-grid" id="brand-snacks"></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">When to reach for ${brand.shortName}</h2>
        <div class="scene-grid">${scenesHtml}</div>
      </div>
    </section>

    ${voicesHtml ? `
    <section class="section">
      <div class="container">
        <h2 class="section-title">What people actually say</h2>
        <p style="font-size:0.85rem;color:#999;margin-bottom:16px">Real quotes from real people on Reddit.</p>
        <div class="voices-grid">${voicesHtml}</div>
      </div>
    </section>` : ''}

    ${articlesHtml ? `
    <section class="section" style="background:#fff">
      <div class="container">
        <h2 class="section-title">Read more</h2>
        <div class="brand-articles">${articlesHtml}</div>
      </div>
    </section>` : ''}

    <div style="text-align:center;padding:24px 16px;font-size:0.85rem;color:#888">
      <a href="${brand.officialUrl}" target="_blank" rel="noopener" style="color:#888">
        Visit ${brand.name} official site →
      </a>
    </div>
  `;

  // Load and render snack cards
  SA.loadSnacks().then(snacks => {
    const matched = snacks.filter(s => brand.makerMatch.some(m =>
      s.maker.toLowerCase().includes(m.toLowerCase())
    ));
    const grid = document.getElementById('brand-snacks');
    grid.innerHTML = matched.map(s => {
      const comment = brand.comments[s.id] || '';
      const cardHtml = SA.renderSnackCard(s, { showTried: true });
      if (comment) {
        return cardHtml.replace('</div>\n          <button',
          `<p class="card-comment">"${comment}"</p></div>\n          <button`);
      }
      return cardHtml;
    }).join('');
    SA.bindTriedButtons(grid);
  });
}
