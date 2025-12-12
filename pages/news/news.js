function toggleDescription(button) {
  const description = button.nextElementSibling;

  if (description.classList.contains("hidden")) {
    description.classList.remove("hidden");
    button.textContent = "Show Less";
  } else {
    description.classList.add("hidden");
    button.textContent = "Show More";
  }
}

function filterArticles() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const articles = document.querySelectorAll('.article');

  articles.forEach(article => {
    const headline = article.querySelector('.headline').textContent.toLowerCase();
    const summary = article.querySelector('.summary').textContent.toLowerCase();
    if (headline.includes(searchInput) || summary.includes(searchInput)) {
      article.style.display = '';
    } else {
      article.style.display = 'none';
    }
  });
}


function toggleBW() {
  const media = document.querySelectorAll('.media-box img, .media-box video');
  media.forEach(el => {
    if (el.style.filter === "grayscale(100%)") {
      el.style.filter = "none";
    } else {
      el.style.filter = "grayscale(100%)";
    }
  });
}


function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// function toggleSidebar() {
//     const sidebar = document.querySelector('.sidebar');
//     sidebar.classList.toggle('active');
// }
