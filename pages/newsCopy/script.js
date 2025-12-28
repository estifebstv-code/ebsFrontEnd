// Mock News Database
const newsData = [
  { id: 1, cat: 'tech', title: "The Quantum Computing Race", intro: "Major tech firms are racing to reach quantum supremacy.", full: "This breakthrough would allow computers to solve problems that would take current supercomputers thousands of years. Research suggests practical applications in medicine and encryption are only years away.", img: "https://picsum.photos/seed/1/800/400" },
  { id: 2, cat: 'business', title: "Stock Market Resilience", intro: "Markets show strength despite global economic shifts.", full: "Experts believe the current diversification in digital assets and green energy is creating a new floor for the global economy. Investors are watching central bank meetings closely.", img: "https://picsum.photos/seed/2/400/250" },
  { id: 3, cat: 'sports', title: "Championship Season Begins", intro: "Teams are prepping for the most intense season yet.", full: "With several key players returning from injury, the odds are shifting. Analysts expect a record-breaking year for viewership and ticket sales.", img: "https://picsum.photos/seed/3/400/250" },
  { id: 4, cat: 'tech', title: "AI in Smart Homes", intro: "How AI is changing the way we live at home.", full: "From energy-saving thermostats to smart security that learns your patterns, the home of the future is finally becoming an affordable reality for the average consumer.", img: "https://picsum.photos/seed/4/400/250" },
  { id: 5, cat: 'business', title: "The Future of Remote Work", intro: "Remote work is no longer just a trend.", full: "A new study shows that 40% of the global workforce prefers a hybrid model, leading to major changes in commercial real estate and city planning.", img: "https://picsum.photos/seed/5/400/250" },
  { id: 6, cat: 'sports', title: "New Training Tech", intro: "Athletes are using VR to enhance performance.", full: "Virtual Reality simulations allow quarterbacks and strikers to practice high-pressure scenarios without the physical toll on their bodies.", img: "https://picsum.photos/seed/6/400/250" }
];

const tickerHeadlines = ["NASA discovers new earth-like planet.", "Tech stocks rally after earnings reports.", "Global marathon record broken in London.", "New fusion energy milestone achieved."];

function init() {
  // 1. Init Ticker
  const ticker = document.getElementById('ticker-scroll');
  ticker.innerHTML = tickerHeadlines.map(h => `<span class="ticker-item">${h}</span>`).join('') + ticker.innerHTML;

  // 2. Initial Render
  renderNews('all');

  // 3. Category Filter Logic
  document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      renderNews(e.target.dataset.category);
    });
  });
}

function renderNews(category) {
  const heroArea = document.getElementById('hero-area');
  const grid = document.getElementById('news-grid');

  const filtered = category === 'all' ? newsData : newsData.filter(n => n.cat === category);

  if (filtered.length > 0) {
    // First item = Hero
    heroArea.innerHTML = createCardHTML(filtered[0], true);
    // Others = Grid
    grid.innerHTML = filtered.slice(1).map(n => createCardHTML(n, false)).join('');
  } else {
    heroArea.innerHTML = "<p>No news found in this category.</p>";
    grid.innerHTML = "";
  }
}

function createCardHTML(item, isHero) {
  return `
        <div class="${isHero ? 'hero-card' : 'news-card'}" id="card-${item.id}">
            <img src="${item.img}" alt="News">
            <div class="card-body">
                <h2>${item.title}</h2>
                <p>${item.intro}</p>
                <div class="more-text">
                    <p>${item.full}</p>
                </div>
                <button class="read-more-btn" onclick="toggleReadMore(${item.id})">Read More</button>
            </div>
        </div>
    `;
}

window.toggleReadMore = function (id) {
  const card = document.getElementById(`card-${id}`);
  card.classList.toggle('expanded');
  const btn = card.querySelector('.read-more-btn');
  btn.innerText = card.classList.contains('expanded') ? "Read Less" : "Read More";
};

document.addEventListener('DOMContentLoaded', init);