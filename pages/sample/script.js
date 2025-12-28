const API_KEY = 'AIzaSyC7yaIulYFJM8FxGVPrRlk00LJ9VqJVhMk';
const CHANNEL_ID = 'UCStExYm_0fiJXgLZwDjqrvQ';
// const CHANNEL_ID = 'UCVcc_sbg3AcXLV9vVufJrGg';


async function init() {
    await fetchBannerTrending();
    await fetchPlaylistsAndVideos();
}

// 1. Banner: Top 5 Trending Thumbnails
async function fetchBannerTrending() {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=5&order=viewCount&type=video&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const slider = document.getElementById('banner-slider');
    data.items.forEach(item => {
        const img = document.createElement('img');
        img.className = 'banner-slide';
        img.src = item.snippet.thumbnails.high.url;
        slider.appendChild(img);
    });

    let index = 0;
    setInterval(() => {
        index = (index + 1) % 5;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }, 6000);
}

// 2. Playlists: Horizontal Rows with Arrows
async function fetchPlaylistsAndVideos() {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=8&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const navLinks = document.getElementById('nav-links');
    const container = document.getElementById('playlist-rows');

    data.items.forEach(pl => {
        // Add to Navbar
        const span = document.createElement('span');
        span.innerText = pl.snippet.title;
        span.onclick = () => document.getElementById(`row-${pl.id}`).scrollIntoView({ behavior: 'smooth' });
        navLinks.appendChild(span);

        // Create Row with Arrow Buttons
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        rowDiv.id = `row-${pl.id}`;
        rowDiv.innerHTML = `
            <h2>${pl.snippet.title}</h2>
            <div class="row-wrapper">
                <button class="handle handle-left" onclick="scrollRow(this, -1)">&#8249;</button>
                <div class="row-posters" id="inner-${pl.id}"></div>
                <button class="handle handle-right" onclick="scrollRow(this, 1)">&#8250;</button>
            </div>
        `;
        container.appendChild(rowDiv);
        loadPlaylistVideos(pl.id, `inner-${pl.id}`);
    });
}

async function loadPlaylistVideos(plId, targetId) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${plId}&maxResults=20&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const target = document.getElementById(targetId);

    data.items.forEach(item => {
        if (item.snippet.title === "Private video") return;
        const img = document.createElement('img');
        img.className = 'poster';
        img.src = item.snippet.thumbnails.medium.url;
        img.alt = item.snippet.title;
        img.onclick = () => openModal(item);
        target.appendChild(img);
    });
}

// 3. Scroll Function for Rows
function scrollRow(btn, direction) {
    const row = btn.parentElement.querySelector('.row-posters');
    const distance = window.innerWidth * 0.7; // Scroll 70% of view width
    row.scrollBy({ left: distance * direction, behavior: 'smooth' });
}

// 4. Modal Functions
function openModal(item) {
    const videoId = item.snippet.resourceId?.videoId || item.id?.videoId;
    const modal = document.getElementById('videoModal');
    const media = document.getElementById('modal-media');

    document.getElementById('modal-title').innerText = item.snippet.title;
    document.getElementById('modal-description').innerText = item.snippet.description;

    media.innerHTML = `<img src="${item.snippet.thumbnails.high.url}" style="width:100%;height:100%;object-fit:cover;">`;

    document.getElementById('main-play-btn').onclick = () => {
        media.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    };

    modal.style.display = "block";
    document.querySelector('.modal-content').scrollTop = 0; // Reset scroll to top
    if (window.gapi) gapi.ytsubscribe.go();
}

function closeModal() {
    document.getElementById('videoModal').style.display = "none";
    document.getElementById('modal-media').innerHTML = "";
}

// 5. Filter Search
function filterRows() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.poster').forEach(p => {
        p.style.display = p.alt.toLowerCase().includes(query) ? "block" : "none";
    });
}

window.onclick = (e) => { if (e.target.id === 'videoModal') closeModal(); };

init();