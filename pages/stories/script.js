// const API_KEY = 'AIzaSyC7yaIulYFJM8FxGVPrRlk00LJ9VqJVhMk';

// // async function fetchYouTubeData() {
// //     const query = document.getElementById('searchQuery').value;
// //     const resultsContainer = document.getElementById('results');

// //     // Clear previous results
// //     resultsContainer.innerHTML = 'Loading...';

// //     // YouTube API Search Endpoint
// //     const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}&type=video`;

// //     try {
// //         const response = await fetch(url);
// //         const data = await response.json();

// //         if (data.items) {
// //             displayResults(data.items);
// //         } else {
// //             resultsContainer.innerHTML = 'No videos found or API error.';
// //         }
// //     } catch (error) {
// //         console.error("Error fetching data:", error);
// //         resultsContainer.innerHTML = 'Error fetching data. Check console.';
// //     }
// // }

// // function displayResults(videos) {
// //     const resultsContainer = document.getElementById('results');
// //     resultsContainer.innerHTML = ''; // Clear loading text

// //     videos.forEach(video => {
// //         const videoId = video.id.videoId;
// //         const title = video.snippet.title;
// //         const thumbnail = video.snippet.thumbnails.medium.url;

// //         const card = `
// //             <div class="video-card">
// //                 <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
// //                     <img src="${thumbnail}" alt="${title}">
// //                     <h3>${title}</h3>
// //                 </a>
// //             </div>
// //         `;
// //         resultsContainer.innerHTML += card;
// //     });
// // }

// const PLAYLIST_ID = 'PLlv1_j3diEkvfqifIyXnTxp0KVhCZWde3'; // Replace with your actual ID

// // async function fetchPlaylist() {
// //     const resultsContainer = document.getElementById('results');
// //     resultsContainer.innerHTML = 'Loading Playlist...';

// //     // PlaylistItems Endpoint
// //     // part=snippet gets titles/thumbnails
// //     // maxResults=50 is the maximum allowed per page
// //     const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

// //     try {
// //         const response = await fetch(url);
// //         const data = await response.json();

// //         if (data.items) {
// //             displayPlaylist(data.items);
// //         } else {
// //             resultsContainer.innerHTML = 'Playlist not found or is private.';
// //         }
// //     } catch (error) {
// //         console.error("Error:", error);
// //     }
// // }

// // function displayPlaylist(items) {
// //     const resultsContainer = document.getElementById('results');
// //     resultsContainer.innerHTML = '';

// //     items.forEach(item => {
// //         const videoId = item.snippet.resourceId.videoId; // Slightly different path for playlists
// //         const title = item.snippet.title;
// //         const thumbnail = item.snippet.thumbnails.medium.url;

// //         resultsContainer.innerHTML += `
// //             <div class="video-card">
// //                 <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
// //                     <img src="${thumbnail}" alt="${title}">
// //                     <h3>${title}</h3>
// //                 </a>
// //             </div>
// //         `;
// //     });
// // }

// // // Call the function on page load if you want it to appear automatically
// // window.onload = fetchPlaylist;
// const CHANNEL_ID = 'UCVcc_sbg3AcXLV9vVufJrGg'; // Needed for the subscribe button
// // let nextPageToken = '';

// // async function fetchPlaylist() {
// //     const resultsContainer = document.getElementById('results');
// //     const loadMoreBtn = document.getElementById('loadMoreBtn');

// //     // Build URL: added &pageToken and changed maxResults to 10
// //     let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

// //     if (nextPageToken) {
// //         url += `&pageToken=${nextPageToken}`;
// //     }

// //     try {
// //         const response = await fetch(url);
// //         const data = await response.json();
// //         console.log(data)
// //         // console.log(data.)

// //         nextPageToken = data.nextPageToken; // Store the token for the next click

// //         displayPlaylist(data.items);

// //         // Show/Hide "Load More" button based on if more videos exist
// //         loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';

// //     } catch (error) {
// //         console.error("Error:", error);
// //     }
// // }

// // function displayPlaylist(items) {
// //     const resultsContainer = document.getElementById('results');

// //     items.forEach(item => {
// //         const videoId = item.snippet.resourceId.videoId;
// //         const videoImageId = item.snippet.thumbnails.standard;
// //         const title = item.snippet.title;
// //         console.log(videoImageId)

// //         const videoCard = document.createElement('div');
// //         videoCard.className = 'video-card';

// //         videoCard.innerHTML = `
// //             <h3>${title}</h3>
// //             <div class="video-wrapper">
// //                  <img src="https://www.youtube.com/embed/${videoImageId}" alt="abc">
// //                 <iframe 
// //                     src="https://www.youtube.com/embed/${videoId}" 
// //                     frameborder="0" 
// //                     allowfullscreen>
// //                 </iframe>
// //             </div>
// //             <div class="sub-container">
// //                 <div class="g-ytsubscribe" data-channelid="${CHANNEL_ID}" data-layout="default" data-count="default"></div>
// //             </div>
// //         `;
// //         resultsContainer.appendChild(videoCard);
// //     });

// //     // Refresh the Google scripts to render the new subscribe buttons
// //     if (window.gapi) {
// //         gapi.ytsubscribe.go();
// //     }
// // }

// // // Initial load
// // window.onload = fetchPlaylist;

// // const API_KEY = 'YOUR_API_KEY';
// // const PLAYLIST_ID = 'YOUR_PLAYLIST_ID';
// // const CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Used for Subscribe button

// let nextPageToken = '';

// async function fetchPlaylist() {
//     const resultsContainer = document.getElementById('results');
//     const loadMoreBtn = document.getElementById('loadMoreBtn');

//     let urls = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

//     if (nextPageToken) {
//         urls += `&pageToken=${nextPageToken}`;
//     }

//     try {
//         const response = await fetch(urls);
//         const data = await response.json();

//         if (data.items) {
//             nextPageToken = data.nextPageToken || '';
//             renderVideos(data.items);

//             // Show button only if there's more to load
//             loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';
//         }
//     } catch (error) {
//         console.error("API Error:", error);
//     }
// }

// function renderVideos(videos) {
//     const resultsContainer = document.getElementById('results');
//     console.log(videos)
//     const dataPrivate = videos;

//     for (let index = 0; index < dataPrivate.length; index++) {
//         const element = dataPrivate[index];
//         const prive = element.snippet.title
//         console.log(element)
//         console.log(prive)

//         if (prive !== 'Private video') {
//             console.log('iffffff' + element)
//         }
//     }

//     videos.forEach(video => {
//         const videoId = video.snippet.resourceId.videoId;
//         const title = video.snippet.title;
//         const thumb = video.snippet.thumbnails.standard;
//         console.log(videos)
//         // console.log(thumb.url)
//         const card = document.createElement('div');
//         card.className = 'video-card';
//         card.innerHTML = `
//             <h3>${title}</h3>
//             <div class="video-container" id="container-${videoId}" onclick="playVideo('${videoId}')">
//                 <img src="${thumb}" id="thumb-${videoId}" class="thumb-img">
//                 <div id="player-${videoId}" class="player-slot"></div>
//             </div>
//             <div class="sub-bar">
//                 <div class="g-ytsubscribe" data-channelid="${CHANNEL_ID}" data-layout="default" data-count="default"></div>
//             </div>
//         `;
//         resultsContainer.appendChild(card);
//     });

//     // Refresh Google Subscribe Buttons
//     if (window.gapi) {
//         gapi.ytsubscribe.go();
//     }
// }

// // Function to swap Thumbnail for Iframe and Autoplay
// function playVideo(videoId) {
//     const playerSlot = document.getElementById(`player-${videoId}`);
//     const thumbImg = document.getElementById(`thumb-${videoId}`);

//     // Only inject iframe if it's not already there
//     if (playerSlot.innerHTML === "") {
//         playerSlot.innerHTML = `
//             <iframe 
//                 src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
//                 allowfullscreen>
//             </iframe>`;
//         thumbImg.style.display = "none"; // Hide the thumbnail
//     }
// }

// // Start on page load
// window.onload = fetchPlaylist;

const API_KEY = 'AIzaSyC7yaIulYFJM8FxGVPrRlk00LJ9VqJVhMk';
const CHANNEL_ID = 'UCVcc_sbg3AcXLV9vVufJrGg';;
// const API_KEY = 'YOUR_API_KEY';
// const CHANNEL_ID = 'YOUR_CHANNEL_ID';

let currentPlaylistId = '';
let nextPageToken = '';

// Initialize
window.onload = fetchPlaylists;

// 1. Fetch Playlists
async function fetchPlaylists() {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    renderPlaylists(data.items);
}

function renderPlaylists(playlists) {
    const grid = document.getElementById('playlistsGrid');
    playlists.forEach(pl => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => showVideosView(pl.id, pl.snippet.title);
        card.innerHTML = `
            <div class="media-box"><img src="${pl.snippet.thumbnails.high.url}"></div>
            <div class="card-header">${pl.snippet.title}</div>
        `;
        grid.appendChild(card);
    });
}

// 2. Fetch Videos (10 at a time)
async function fetchVideos() {
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${currentPlaylistId}&maxResults=10&key=${API_KEY}`;
    if (nextPageToken) url += `&pageToken=${nextPageToken}`;

    const response = await fetch(url);
    const data = await response.json();
    nextPageToken = data.nextPageToken || '';

    renderVideos(data.items);
    updateTicker(data.items);
    document.getElementById('loadMoreBtn').style.display = nextPageToken ? 'block' : 'none';
}

function renderVideos(items) {
    const grid = document.getElementById('videosGrid');
    items.forEach(item => {
        if (item.snippet.title === "Private video") return;
        const vId = item.snippet.resourceId.videoId;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">${item.snippet.title}</div>
            <div class="media-box" onclick="playVideo('${vId}')">
                <img src="${item.snippet.thumbnails.high.url}" id="img-${vId}">
                <div id="player-${vId}"></div>
            </div>
            <div class="card-body">${item.snippet.description.substring(0, 100)}...</div>
        `;
        grid.appendChild(card);
    });
    if (window.gapi) gapi.ytsubscribe.go();
}

// 3. Helper Functions
function playVideo(vId) {
    const container = document.getElementById(`player-${vId}`);
    container.innerHTML = `<iframe src="https://www.youtube.com/embed/${vId}?autoplay=1" allowfullscreen allow="autoplay"></iframe>`;
    document.getElementById(`img-${vId}`).style.display = 'none';
}

function updateTicker(items) {
    const ticker = document.getElementById('ticker-text');
    items.forEach(item => {
        ticker.innerHTML += `<span class="ticker-item">BREAKING: ${item.snippet.title}</span>`;
    });
}

function showVideosView(id, title) {
    currentPlaylistId = id;
    nextPageToken = '';
    document.getElementById('videosGrid').innerHTML = '';
    document.getElementById('playlistsGrid').style.display = 'none';
    document.getElementById('videosView').style.display = 'block';
    document.getElementById('backBtn').style.display = 'inline-block';
    document.getElementById('mainTitle').innerText = title;
    fetchVideos();
}

function showPlaylistsView() {
    document.getElementById('playlistsGrid').style.display = 'grid';
    document.getElementById('videosView').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('mainTitle').innerText = "Channel Playlists";
}

function filterContent() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.card-header').innerText.toLowerCase();
        card.style.display = title.includes(term) ? "flex" : "none";
    });
}

function setCategory(cat) {
    document.getElementById('searchInput').value = cat;
    filterContent();
}