/* Okashi — Core App Logic */

const SA = {
  snacks: [],
  collected: JSON.parse(localStorage.getItem('sa_collected') || '[]'),

  async loadSnacks() {
    const base = location.pathname.includes('/okashi') ? '/okashi' : '';
    const res = await fetch(`${base}/data/snacks.json`);
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

  renderSnackCard(s, opts = {}) {
    const collected = this.isCollected(s.id);
    const showTried = opts.showTried !== false;
    const flavorTags = s.flavors.map(f => `<span class="tag tag-flavor">${f}</span>`).join('');
    const texTag = `<span class="tag tag-texture">${s.texture}</span>`;
    return `
      <div class="card-wrapper">
        <div class="card ${collected ? 'card-collected' : ''}" data-id="${s.id}">
          <div class="card-check">✓</div>
          <div class="card-img">${s.name_en}</div>
          <div class="card-body">
            <div class="card-title">${s.name_en}</div>
            <div class="card-maker">${s.maker} · ${s.name_ja}</div>
            <div class="card-tags">${flavorTags}${texTag}</div>
          </div>
          ${showTried ? `<button class="tried-btn ${collected ? 'is-tried' : 'not-tried'}" data-id="${s.id}">${collected ? '✓ Tried!' : 'Mark as Tried'}</button>` : ''}
        </div>
      </div>`;
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
  const links = [
    ['Explore', 'explore.html'],
    ['Tier List', 'tierlist.html'],
    ['Quiz', 'quiz.html'],
    ['Collection', 'collection.html'],
    ['About', 'about.html']
  ];
  const linksHtml = links.map(([label, href]) => {
    const isCurrent = active === label.toLowerCase().replace(' ', '');
    return `<a href="${href}" style="${isCurrent ? 'color:var(--primary)' : ''}">${label}</a>`;
  }).join('');
  return `<nav class="nav"><div class="nav-inner">
    <a href="index.html" class="nav-logo"><span>🍡</span> Okashi</a>
    <div class="nav-links">${linksHtml}</div>
  </div></nav>`;
}
