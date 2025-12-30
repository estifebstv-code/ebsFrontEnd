// 1. CONFIGURATION
const TELEGRAM_CHANNEL = 'ebstvnews'; // Replace with your public channel username
const CACHE_KEY = 'news_portal_cache';
const ITEMS_PER_PAGE = 10;

let allNews = [];
let currentPageItems = [];
let currentPage = 1;
let currentModalIndex = 0;
let oldestPostId = null;
let isLoading = false;

// 2. INITIALIZATION
async function init() {
  // Instant load from cache
  const cache = localStorage.getItem(CACHE_KEY);
  if (cache) {
    allNews = JSON.parse(cache);
    hideSkeleton();
    renderPage(1);
    updateTicker();
  }
  // Fetch fresh news in background
  await fetchNews();
}

// 3. FETCHING DATA
async function fetchNews(isLoadMore = false) {
  if (isLoading) return;
  isLoading = true;

  let targetUrl = `https://t.me/s/${TELEGRAM_CHANNEL}`;
  if (isLoadMore && oldestPostId) {
    targetUrl += `?before=${oldestPostId}`;
  }

  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&cb=${Date.now()}`;

  try {
    const response = await fetch(proxy);
    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    const postElements = Array.from(doc.querySelectorAll('.tgme_widget_message_wrap')).reverse();

    const fetchedItems = [];
    postElements.forEach(el => {
      const textEl = el.querySelector('.tgme_widget_message_text');
      const photoEl = el.querySelector('.tgme_widget_message_photo_wrap');
      const dateEl = el.querySelector('.tgme_widget_message_date');

      if (textEl && dateEl) {
        const postLink = dateEl.getAttribute('href');
        const postId = parseInt(postLink.split('/').pop());

        if (!oldestPostId || postId < oldestPostId) oldestPostId = postId;

        if (!allNews.some(item => item.postId === postId)) {
          let img = `https://picsum.photos/seed/${postId}/800/400`;
          if (photoEl) {
            const style = photoEl.getAttribute('style');
            const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) img = match[1];
          }
          fetchedItems.push({
            postId,
            title: textEl.textContent.split('\n')[0].substring(0, 70) + "...",
            intro: textEl.textContent.substring(0, 130) + "...",
            full: textEl.innerHTML,
            img,
            link: postLink
          });
        }
      }
    });

    if (fetchedItems.length > 0) {
      allNews = isLoadMore ? [...allNews, ...fetchedItems] : [...fetchedItems, ...allNews];
      localStorage.setItem(CACHE_KEY, JSON.stringify(allNews.slice(0, 50)));
      hideSkeleton();
      renderPage(currentPage);
      updateTicker();
    }
  } catch (e) {
    console.error("Scraping Error:", e);
  } finally {
    isLoading = false;
  }
}

// 4. RENDERING
function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * ITEMS_PER_PAGE;
  currentPageItems = allNews.slice(start, start + ITEMS_PER_PAGE);

  if (currentPageItems.length === 0 && page > 1) {
    fetchNews(true);
    return;
  }

  const heroArea = document.getElementById('hero-area');
  const grid = document.getElementById('news-grid');

  if (currentPageItems.length > 0) {
    heroArea.innerHTML = createCardHTML(currentPageItems[0], 0, true);
    grid.innerHTML = currentPageItems.slice(1).map((item, i) => createCardHTML(item, i + 1, false)).join('');
  }

  updatePaginationUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createCardHTML(item, index, isHero) {
  return `
        <div class="${isHero ? 'hero-card' : 'news-card'}">
            <img src="${item.img}" loading="lazy">
            <div class="card-body">
                <h2>${item.title}</h2>
                <button class="read-more-btn" onclick="openModal(${index})">Read More</button>
            </div>
        </div>
    `;
}

// 5. MODAL LOGIC
function openModal(index) {
  currentModalIndex = index;
  updateModalContent();
  document.getElementById('news-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function updateModalContent() {
  const item = currentPageItems[currentModalIndex];
  document.getElementById('modal-body').innerHTML = `
        <img src="${item.img}">
        <h2>${item.title}</h2>
        <div style="font-size:1.1rem; line-height:1.7;">${item.full}</div>
    `;
  document.getElementById('modal-prev').disabled = (currentModalIndex === 0);
  document.getElementById('modal-next').disabled = (currentModalIndex === currentPageItems.length - 1);
}

// 6. EVENT LISTENERS
document.getElementById('modal-next').onclick = () => { currentModalIndex++; updateModalContent(); };
document.getElementById('modal-prev').onclick = () => { currentModalIndex--; updateModalContent(); };
document.getElementById('close-modal').onclick = () => {
  document.getElementById('news-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
};

document.getElementById('next-btn').onclick = () => {
  if ((currentPage * ITEMS_PER_PAGE) >= allNews.length) {
    fetchNews(true).then(() => renderPage(currentPage + 1));
  } else {
    renderPage(currentPage + 1);
  }
};

document.getElementById('prev-btn').onclick = () => renderPage(currentPage - 1);

document.getElementById('refresh-btn').onclick = () => {
  localStorage.removeItem(CACHE_KEY);
  location.reload();
};

// HELPERS
function hideSkeleton() {
  document.getElementById('skeleton-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
}

function updatePaginationUI() {
  document.getElementById('page-number').innerText = `Page ${currentPage}`;
  document.getElementById('prev-btn').disabled = (currentPage === 1);
}

function updateTicker() {
  const ticker = document.getElementById('ticker-scroll');
  const headlines = allNews.slice(0, 8).map(n => n.title);
  ticker.innerHTML = headlines.map(h => `<span class="ticker-item">${h}</span>`).join('') +
    headlines.map(h => `<span class="ticker-item">${h}</span>`).join('');
}

document.addEventListener('DOMContentLoaded', init);