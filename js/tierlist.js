/* Tierlist — Drag & Drop (SortableJS) + Export
   native HTML5 drag-drop は タッチ非対応 + Edge/Firefoxで img内包時に不安定 →
   SortableJS (44KB・MIT・タッチ対応・cross-zone) に置き換え */
document.getElementById('nav').innerHTML = renderNav('tierlist');

function createTierItem(snack) {
  const el = document.createElement('div');
  el.className = 'tier-item notranslate';
  el.setAttribute('translate', 'no');
  el.lang = 'en';
  el.dataset.id = snack.id;
  el.title = snack.name_en;
  const img = snack.image || (snack.photos && snack.photos[0] && `images/webp/${snack.photos[0].img}.webp`);
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = (location.pathname.includes('/okashi') ? '/okashi/' : '') + img;
    imgEl.alt = snack.name_en;
    imgEl.loading = 'lazy';
    imgEl.draggable = false;
    el.appendChild(imgEl);
  }
  const label = document.createElement('span');
  label.className = 'tier-item-name notranslate';
  label.setAttribute('translate', 'no');
  label.lang = 'en';
  label.textContent = snack.name_en;
  el.appendChild(label);
  return el;
}

SA.loadSnacks().then(snacks => {
  const pool = document.getElementById('pool');
  snacks.forEach(s => pool.appendChild(createTierItem(s)));
  // 画像系アイテムでHTML5 native dragが2回目以降動かないバグ (#1571,#2426) を回避
  // fallback統一 + fallbackOnBody無効でゴースト複製を避けて軽量化
  const opts = {
    group: 'tier',
    animation: 150,
    ghostClass: 'dragging',
    forceFallback: true,
    fallbackTolerance: 4,
    swapThreshold: 0.5,
    emptyInsertThreshold: 20,
    delay: 0,
    preventOnFilter: true,
  };
  // 念のため dragstart を root レベルで prevent (Edge の native image drag 暴発防止)
  document.addEventListener('dragstart', e => e.preventDefault());
  document.querySelectorAll('.tier-items').forEach(z => Sortable.create(z, opts));
  Sortable.create(pool, opts);
});

/* Export as PNG */
document.getElementById('export-btn').addEventListener('click', () => {
  const canvas = document.getElementById('export-canvas');
  const ctx = canvas.getContext('2d');
  const tiers = ['S','A','B','C','D'];
  const colors = {'S':'#ff7f7f','A':'#ffbf7f','B':'#ffff7f','C':'#7fff7f','D':'#7fbfff'};
  const rowH = 70;
  const labelW = 50;
  const itemW = 62;
  const itemH = 55;
  const pad = 4;
  const headerH = 40;

  let maxItems = 0;
  const tierData = tiers.map(t => {
    const zone = document.querySelector(`.tier-items[data-tier="${t}"]`);
    const items = [...zone.querySelectorAll('.tier-item')].map(el => el.textContent);
    maxItems = Math.max(maxItems, items.length);
    return { tier: t, items };
  });

  const canvasW = Math.max(labelW + (maxItems || 3) * (itemW + pad) + pad + 10, 400);
  const canvasH = headerH + tiers.length * rowH + 30;
  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('My Japanese Snack Tier List', canvasW / 2, 26);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#888';
  ctx.fillText('humancronadmin.github.io/okashi', canvasW / 2, canvasH - 10);

  tierData.forEach(({ tier, items }, i) => {
    const y = headerH + i * rowH;
    ctx.fillStyle = colors[tier];
    ctx.fillRect(0, y, labelW, rowH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tier, labelW / 2, y + rowH / 2 + 8);

    ctx.fillStyle = '#16213e';
    ctx.fillRect(labelW, y, canvasW - labelW, rowH);

    items.forEach((name, j) => {
      const x = labelW + pad + j * (itemW + pad);
      ctx.fillStyle = '#0f3460';
      ctx.fillRect(x, y + pad, itemW, itemH);
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      const lines = wrapText(name, itemW - 6);
      lines.forEach((line, li) => ctx.fillText(line, x + itemW / 2, y + pad + 18 + li * 12));
    });
  });

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const preview = document.getElementById('export-preview');
    preview.innerHTML = `<img src="${url}" style="max-width:100%;border-radius:8px;margin-bottom:8px"><br>
      <a href="${url}" download="my-snack-tierlist.png" class="btn btn-sm btn-primary">Download PNG</a>`;
    const shareRow = document.getElementById('share-row');
    shareRow.style.display = 'flex';
    const text = encodeURIComponent('My Japanese Snack Tier List 🍡 Create yours at humancronadmin.github.io/okashi #JapaneseSnacks #TierList');
    document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${text}`;
    document.getElementById('share-reddit').href = `https://reddit.com/r/JapaneseSnacks/submit?title=${encodeURIComponent('My Japanese Snack Tier List')}&selftext=true`;
  });
});

document.getElementById('reset-btn').addEventListener('click', () => {
  const pool = document.getElementById('pool');
  document.querySelectorAll('.tier-items .tier-item').forEach(el => pool.appendChild(el));
  document.getElementById('export-preview').innerHTML = '';
  document.getElementById('share-row').style.display = 'none';
});

function wrapText(text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach(w => {
    if ((line + ' ' + w).length > maxW / 5) { lines.push(line.trim()); line = w; }
    else line += (line ? ' ' : '') + w;
  });
  if (line) lines.push(line.trim());
  return lines.slice(0, 3);
}
