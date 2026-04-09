/* Snack Personality Quiz */
document.getElementById('nav').innerHTML = renderNav('quiz');

const questions = [
  {
    q: "It's 3 PM and you need a snack. You reach for something...",
    opts: [
      { text: "Sweet and indulgent", scores: { chocolate: 2, strawberry: 1 } },
      { text: "Savory and salty", scores: { cheese: 2, crunchy: 1 } },
      { text: "Light and refreshing", scores: { matcha: 2, adventure: 1 } },
      { text: "Chewy and satisfying", scores: { mochi: 2, strawberry: 1 } }
    ]
  },
  {
    q: "Your ideal texture in a snack is...",
    opts: [
      { text: "Crispy and crunchy", scores: { crunchy: 3 } },
      { text: "Soft and melty", scores: { chocolate: 2, mochi: 1 } },
      { text: "Chewy and stretchy", scores: { mochi: 3 } },
      { text: "Light and airy", scores: { konbini: 2, adventure: 1 } }
    ]
  },
  {
    q: "At a Japanese convenience store, you go straight to...",
    opts: [
      { text: "The chocolate shelf", scores: { chocolate: 3 } },
      { text: "The chips and savory section", scores: { cheese: 2, crunchy: 1 } },
      { text: "The seasonal limited-edition display", scores: { adventure: 3 } },
      { text: "The drink cooler to pair with my snack", scores: { matcha: 2, konbini: 1 } }
    ]
  },
  {
    q: "If you could only have one flavor forever, it would be...",
    opts: [
      { text: "Matcha / Green tea", scores: { matcha: 3 } },
      { text: "Strawberry / Fruity", scores: { strawberry: 3 } },
      { text: "Cheese / Savory", scores: { cheese: 3 } },
      { text: "Chocolate / Rich", scores: { chocolate: 3 } }
    ]
  },
  {
    q: "When you see a snack you've never tried, you...",
    opts: [
      { text: "Buy it immediately — must try everything!", scores: { adventure: 3 } },
      { text: "Check the flavor description first", scores: { matcha: 1, konbini: 2 } },
      { text: "Only try it if someone recommends it", scores: { strawberry: 1, chocolate: 1 } },
      { text: "Stick to what I know I like", scores: { crunchy: 1, cheese: 1 } }
    ]
  },
  {
    q: "Your friends would say your snacking style is...",
    opts: [
      { text: "Sophisticated — you have refined taste", scores: { matcha: 2, chocolate: 1 } },
      { text: "Fun — you always share snacks", scores: { strawberry: 2, konbini: 1 } },
      { text: "Bold — you try the weirdest flavors", scores: { adventure: 2, cheese: 1 } },
      { text: "Classic — you know what you like", scores: { crunchy: 2, mochi: 1 } }
    ]
  }
];

const types = {
  matcha: {
    name: "Matcha Mystic",
    emoji: "🍵",
    color: "#4a7c59",
    desc: "You appreciate subtle, refined flavors. You'd pick quality over quantity and probably enjoy a quiet afternoon with green tea and wagashi.",
    snacks: "Try: KitKat Matcha, Pocky Matcha, Matcha Pocky"
  },
  strawberry: {
    name: "Strawberry Sweetheart",
    emoji: "🍓",
    color: "#e85d75",
    desc: "Sweet, cheerful, and always up for sharing. You love cute packaging and fruity flavors that brighten your day.",
    snacks: "Try: Pocky Strawberry, Apollo Chocolate, Hi-Chew Strawberry"
  },
  cheese: {
    name: "Cheese Champion",
    emoji: "🧀",
    color: "#d4a017",
    desc: "Savory over sweet, every time. You're the person who reaches for chips at a party and knows every cheese snack on the shelf.",
    snacks: "Try: Cheeza Cheddar, Jagariko Cheese, Umaibo Corn Potage"
  },
  chocolate: {
    name: "Chocolate Connoisseur",
    emoji: "🍫",
    color: "#5c3317",
    desc: "You believe chocolate is a food group. Rich, melty, and indulgent — you know the difference between good and great chocolate.",
    snacks: "Try: Royce' Nama Chocolate, Black Thunder, Alfort Mini"
  },
  crunchy: {
    name: "Crunchy Commander",
    emoji: "🥨",
    color: "#c97b2a",
    desc: "Texture is everything. You live for that satisfying crunch and can't stop once you start with a bag of crispy snacks.",
    snacks: "Try: Kaki no Tane, Kata-Age Chips, Kappa Ebisen"
  },
  mochi: {
    name: "Mochi Master",
    emoji: "🍡",
    color: "#9b59b6",
    desc: "You love traditional Japanese flavors and the unique chewy texture of mochi. You appreciate craftsmanship in every bite.",
    snacks: "Try: Nama Yatsuhashi, Milky Candy, Country Ma'am"
  },
  adventure: {
    name: "Adventure Seeker",
    emoji: "🗺️",
    color: "#e67e22",
    desc: "You try every limited-edition flavor and hunt for regional exclusives. For you, snacking is an exploration, not just eating.",
    snacks: "Try: Seasonal KitKat flavors, Tokyo Banana, Regional limited snacks"
  },
  konbini: {
    name: "Konbini King",
    emoji: "🏪",
    color: "#3498db",
    desc: "You know every Japanese convenience store like the back of your hand. You're always first to spot new releases on the shelf.",
    snacks: "Try: Everything at 7-Eleven, FamilyMart, and Lawson!"
  }
};

let current = 0;
const scores = {};

function showQuestion() {
  if (current >= questions.length) { showResult(); return; }
  const q = questions[current];
  const pct = (current / questions.length * 100).toFixed(0);
  document.getElementById('progress').style.width = pct + '%';
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">${q.opts.map((o, i) =>
      `<div class="quiz-option" data-idx="${i}">${o.text}</div>`
    ).join('')}</div>`;
}

document.getElementById('quiz-body').addEventListener('click', e => {
  const opt = e.target.closest('.quiz-option');
  if (!opt) return;
  const idx = parseInt(opt.dataset.idx);
  const chosen = questions[current].opts[idx];
  Object.entries(chosen.scores).forEach(([k, v]) => { scores[k] = (scores[k] || 0) + v; });
  current++;
  showQuestion();
});

function showResult() {
  document.getElementById('progress').style.width = '100%';
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const type = types[top[0]];
  const shareText = encodeURIComponent(`I'm a ${type.name} ${type.emoji}! What's your Japanese snack personality? Take the quiz:`);
  const shareUrl = encodeURIComponent('https://humancronadmin.github.io/okashi/quiz.html');

  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-result">
      <div style="font-size:4rem;margin-bottom:12px">${type.emoji}</div>
      <div class="quiz-result-type" style="color:${type.color}">${type.name}</div>
      <div class="quiz-result-desc">${type.desc}</div>
      <p style="font-weight:600;margin-bottom:24px">${type.snacks}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" class="btn btn-sm btn-primary">Share on X</a>
        <a href="https://reddit.com/r/JapaneseSnacks/submit?title=${encodeURIComponent('I got ' + type.name + '! What\'s your Japanese snack personality?')}&url=${shareUrl}" target="_blank" class="btn btn-sm btn-outline">Share on Reddit</a>
        <button class="btn btn-sm btn-secondary" onclick="current=0;Object.keys(scores).forEach(k=>delete scores[k]);showQuestion()">Retake Quiz</button>
      </div>
      <div style="margin-top:24px">
        <a href="explore.html" class="btn btn-outline">Explore Snacks →</a>
      </div>
    </div>`;
}

showQuestion();
