const API_KEY = "a9c4cc38";
// const API_KEY = "YOUR_OMDB_API_KEY";


const movies = [
  { title: "Inception", cat: "Sci-Fi" },
  { title: "Interstellar", cat: "Sci-Fi" },
  { title: "The Dark Knight", cat: "Action" },
  { title: "Gladiator", cat: "Action" },
  { title: "Joker", cat: "Drama" },
  { title: "Titanic", cat: "Drama" },
  { title: "The Hangover", cat: "Comedy" },
  { title: "Avengers", cat: "Action" }
];


const modal = document.getElementById('modal');


async function fetchMovie(title) {
  const res = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
  return res.json();
}


async function bannerLoad() {
  const data = await fetchMovie(movies[0].title);
  bannerImg.src = data.Poster;
  bannerTitle.textContent = data.Title;
  bannerPlot.textContent = data.Plot;
}


async function renderRow(id, cat) {
  const row = document.getElementById(id);
  row.innerHTML = '<div class="skeleton"></div>'.repeat(6);


  row.innerHTML = '';
  for (let m of movies.filter(x => cat === 'all' || x.cat === cat)) {
    const data = await fetchMovie(m.title);
    const img = document.createElement('img');
    img.src = data.Poster;
    img.className = 'poster';
    img.onclick = () => openModal(data);
    row.appendChild(img);
  }
}


function openModal(movie) {
  modal.style.display = 'block';
  modalImg.src = movie.Poster;
  modalTitle.textContent = movie.Title;
  modalPlot.textContent = movie.Plot;
}


close.onclick = () => modal.style.display = 'none';


// CATEGORY FILTER
document.querySelectorAll('.cat').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderRow('action', btn.dataset.cat);
  };
});


bannerLoad();
renderRow('trending', 'all');
renderRow('action', 'Action');
renderRow('comedy', 'Comedy');
renderRow('drama', 'Drama');