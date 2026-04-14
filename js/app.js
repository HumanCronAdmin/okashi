/* Okashi — Core App Logic */

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
    const imgHtml = s.image
      ? `<img src="${this.base}/${s.image}" alt="${s.name_en}" class="card-photo" loading="lazy">`
      : `<div class="card-placeholder" style="background:${color}20;border-bottom:3px solid ${color}">
           <span style="font-size:2rem">${this.categoryEmoji(s.category)}</span>
           <span style="font-size:0.75rem;color:${color};font-weight:600">${s.name_en}</span>
         </div>`;
    return `
      <div class="card-wrapper">
        <div class="card ${collected ? 'card-collected' : ''}" data-id="${s.id}">
          <div class="card-check">✓</div>
          ${imgHtml}
          <div class="card-body">
            <div class="card-title">${s.name_en}</div>
            <div class="card-maker">${s.maker} · ${s.name_ja}</div>
            <div class="card-tags">${flavorTags}${texTag}</div>
          </div>
          ${showTried ? `<button class="tried-btn ${collected ? 'is-tried' : 'not-tried'}" data-id="${s.id}">${collected ? '✓ Tried!' : 'Mark as Tried'}</button>` : ''}
          ${s.amazon_us ? `<a href="${s.amazon_us}" target="_blank" rel="noopener" class="buy-btn">Buy on Amazon</a>` : ''}
        </div>
      </div>`;
  },

  categoryEmoji(cat) {
    return {chocolate:'🍫',cookie:'🍪',chips:'🥔',candy:'🍬','rice-cracker':'🍘',gummy:'🧸',mochi:'🍡',cake:'🍰'}[cat]||'🍿';
  },

  bindTriedButtons(container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.tried-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      const now = this.toggleCollected(id);
      btn.className = `tried-btn ${now ? 'is-tried' : 'not-tried'}`;
      btn.textContent = now ? '✓ Tried!' : 'Mark as Tried';
      const card = btn.closest('.card');
      if (card) card.classList.toggle('card-collected', now);
      document.dispatchEvent(new CustomEvent('sa:collected-changed'));
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
