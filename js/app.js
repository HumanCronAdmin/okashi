/* Okashi — Core App Logic */

/* 他プロジェクト (例: TinyFit) のService Workerが localhost origin に残ると、
   Okashi の /css/style.css や /index.html が他プロジェクトのキャッシュに置換される。
   Okashi自身はSW未使用なので、unregister + cache全削除する。
   localStorage で「掃除済」を永続マーク。auto-reload は1回だけ・User操作中のリロード暴走を防ぐ。 */
(async () => {
  if (!('serviceWorker' in navigator)) return;
  // 一度掃除済なら無条件 return。controller が残っていても reload しない
  // (drag 中の auto-reload で操作が飛ぶため。unregister は次回ナビで効く)
  if (localStorage.getItem('okashi_sw_cleaned_v2')) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  if (window.caches) {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  }
  if (regs.length) {
    await Promise.all(regs.map(r => r.unregister()));
    console.log('[Okashi] cleared', regs.length, 'stale SW + caches');
  }
  localStorage.setItem('okashi_sw_cleaned_v2', '1');
})();

const SA = {
  snacks: [],
  collected: JSON.parse(localStorage.getItem('sa_collected') || '[]'),

  base: '',

  async loadSnacks() {
    this.base = location.pathname.includes('/okashi') ? '/okashi' : '';
    const res = await fetch(`${this.base}/data/snacks.json`);
    const data = await res.json();
    this.snacks = data.snacks;
    return this.snacks;
  },

  async loadGuides() {
    if (!this.base) this.base = location.pathname.includes('/okashi') ? '/okashi' : '';
    const res = await fetch(`${this.base}/data/guides.json`);
    const data = await res.json();
    return data.guides;
  },

  renderGuideCard(g) {
    const typeLabel = {review:'Review', ranking:'Ranking', guide:'Guide'}[g.type] || 'Guide';
    return `
      <a href="${this.base}/articles/${g.slug}.html" class="guide-card">
        <div class="guide-emoji">${g.emoji}</div>
        <div class="guide-body">
          <span class="guide-type">${typeLabel}</span>
          <div class="guide-title">${g.title}</div>
          <div class="guide-desc">${g.desc}</div>
        </div>
      </a>`;
  },

  isCollected(id) {
    return this.collected.includes(id);
  },

  toggleCollected(id) {
    if (this.isCollected(id)) {
      this.collected = this.collected.filter(x => x !== id);
    } else {
      this.collected.push(id);
    }
    localStorage.setItem('sa_collected', JSON.stringify(this.collected));
    return this.isCollected(id);
  },

  getCollectedCount() {
    return this.collected.length;
  },

  categoryColors: {
    chocolate:'#5c3317',cookie:'#c97b2a',chips:'#d4a017',candy:'#e85d75',
    'rice-cracker':'#8b6914',gummy:'#9b59b6',mochi:'#7c5295',cake:'#c0756e'
  },

  renderSnackCard(s, opts = {}) {
    const collected = this.isCollected(s.id);
    const showTried = opts.showTried !== false;
    const flavorTags = s.flavors.map(f => `<span class="tag tag-flavor">${f}</span>`).join('');
    const texTag = `<span class="tag tag-texture">${s.texture}</span>`;
    const color = this.categoryColors[s.category] || '#888';
    const photos = s.photos && s.photos.length > 1 ? s.photos : null;
    const photosJson = photos ? encodeURIComponent(JSON.stringify(photos.map(p => p.img))) : '';
    const imgHtml = s.image
      ? `<img src="${this.base}/${s.image}" alt="${s.name_en}" class="card-photo" data-snack="${s.id}" data-idx="0" data-photos="${photosJson}" loading="lazy">`
      : `<div class="card-placeholder" style="background:${color}20;border-bottom:3px solid ${color}">
           <span style="font-size:2rem">${this.categoryEmoji(s.category)}</span>
           <span style="font-size:0.75rem;color:${color};font-weight:600">${s.name_en}</span>
         </div>`;
    const galleryHtml = photos ? `
      <div class="card-gallery">
        <button class="gallery-arrow" data-dir="-1" data-snack="${s.id}" aria-label="前の写真">←</button>
        <span class="gallery-counter" data-snack="${s.id}">1 / ${photos.length}</span>
        <button class="gallery-arrow" data-dir="1" data-snack="${s.id}" aria-label="次の写真">→</button>
      </div>` : '';
    return `
      <div class="card-wrapper">
        <div class="card ${collected ? 'card-collected' : ''}" data-id="${s.id}">
          <div class="card-check">✓</div>
          ${imgHtml}
          ${galleryHtml}
          <div class="card-body">
            <div class="card-title">${s.name_en}</div>
            ${s.maker || s.name_ja ? `<div class="card-maker">${[s.maker, s.name_ja].filter(Boolean).join(' · ')}</div>` : ''}
            <div class="card-tags">${flavorTags}${texTag}</div>
          </div>
          ${showTried ? `<button class="tried-btn ${collected ? 'is-tried' : 'not-tried'}" data-id="${s.id}">${collected ? '✓ Tried!' : 'Mark as Tried'}</button>` : ''}
          ${s.article ? `<a href="${this.base}/articles/${s.article}.html" class="review-btn">📖 Read review</a>` : `<span class="review-btn" style="opacity:0.5;cursor:default">Review coming soon</span>`}
          ${s.amazon_us ? `<a href="${s.amazon_us}" target="_blank" rel="noopener" class="buy-btn">Buy on Amazon</a>` : ''}
        </div>
      </div>`;
  },

  categoryEmoji(cat) {
    return {chocolate:'🍫',cookie:'🍪',chips:'🥔',candy:'🍬','rice-cracker':'🍘',gummy:'🧸',mochi:'🍡',cake:'🍰'}[cat]||'🍿';
  },

  bindTriedButtons(container) {
    container.addEventListener('click', (e) => {
      const tBtn = e.target.closest('.tried-btn');
      if (tBtn) {
        const id = tBtn.dataset.id;
        const now = this.toggleCollected(id);
        tBtn.className = `tried-btn ${now ? 'is-tried' : 'not-tried'}`;
        tBtn.textContent = now ? '✓ Tried!' : 'Mark as Tried';
        const card = tBtn.closest('.card');
        if (card) card.classList.toggle('card-collected', now);
        document.dispatchEvent(new CustomEvent('sa:collected-changed'));
        return;
      }
      const aBtn = e.target.closest('.gallery-arrow');
      if (aBtn) {
        const card = aBtn.closest('.card');
        const photo = card.querySelector('.card-photo');
        const counter = card.querySelector('.gallery-counter');
        if (!photo) return;
        const photos = JSON.parse(decodeURIComponent(photo.dataset.photos));
        let idx = parseInt(photo.dataset.idx || '0');
        idx = (idx + parseInt(aBtn.dataset.dir) + photos.length) % photos.length;
        photo.dataset.idx = idx;
        photo.src = `${this.base}/images/webp/${photos[idx]}.webp`;
        if (counter) counter.textContent = `${idx + 1} / ${photos.length}`;
      }
    });
  }
};

/* NAV HTML */
function renderNav(active) {
  const inSubdir = location.pathname.includes('/brands/') || location.pathname.includes('/articles/');
  const pre = inSubdir ? '../' : '';
  const links = [
    ['Explore', pre + 'explore.html'],
    ['Brands', pre + 'brands/'],
    ['Tier List', pre + 'tierlist.html'],
    ['Quiz', pre + 'quiz.html'],
    ['Collection', pre + 'collection.html'],
    ['About', pre + 'about.html']
  ];
  const linksHtml = links.map(([label, href]) => {
    const isCurrent = active === label.toLowerCase().replace(' ', '');
    return `<a href="${href}" style="${isCurrent ? 'color:var(--primary)' : ''}">${label}</a>`;
  }).join('');
  return `<nav class="nav"><div class="nav-inner">
    <a href="${pre}index.html" class="nav-logo"><span>🍡</span> Okashi</a>
    <div class="nav-links">${linksHtml}</div>
  </div></nav>`;
}
