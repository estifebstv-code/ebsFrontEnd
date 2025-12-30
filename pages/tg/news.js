const API = "http://localhost:3001/api/news";

const tickerTrack = document.getElementById("tickerTrack");
const featured = document.getElementById("featured");
const grid = document.getElementById("newsGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const modeToggle = document.getElementById("modeToggle");

let news = [];
let visible = 4;

fetch(API)
  .then(res => res.json())
  .then(data => {
    news = data;
    buildTicker();
    renderFeatured();
    renderGrid();
  });

function buildTicker() {
  tickerTrack.innerHTML = "";
  news.slice(0, 10).forEach(n => {
    const span = document.createElement("span");
    span.textContent = getHeadline(n.text);
    tickerTrack.appendChild(span);
  });
}

function renderFeatured() {
  featured.innerHTML = "";
  news.slice(0, 2).forEach(n => {
    featured.innerHTML += createCard(n, true);
  });
}

function renderGrid() {
  grid.innerHTML = "";
  news.slice(2, visible + 2).forEach(n => {
    grid.innerHTML += createCard(n);
  });
}

loadMoreBtn.onclick = () => {
  visible += 4;
  renderGrid();
};

function createCard(n, big = false) {
  return `
  <div class="${big ? "featured-card" : "news-card"}">
    ${n.image ? `<img src="${n.image}">` : ""}
    <div class="content">
      <h3>${getHeadline(n.text)}</h3>
      <p class="full-text" style="display:none">${n.text}</p>
      <button class="read-more" onclick="toggleText(this)">Read More</button>
    </div>
  </div>`;
}

function toggleText(btn) {
  const p = btn.previousElementSibling;
  p.style.display = p.style.display === "none" ? "block" : "none";
  btn.textContent = p.style.display === "none" ? "Read More" : "Show Less";
}

function getHeadline(text) {
  return text.split("\n")[0].slice(0, 70) + "...";
}

/* DARK / LIGHT MODE */
modeToggle.onclick = () => {
  document.body.classList.toggle("light");
  modeToggle.textContent =
    document.body.classList.contains("light") ? "🌙" : "☀";
};
