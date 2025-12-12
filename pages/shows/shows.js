// Fade-in animation
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

fadeElements.forEach((el) => observer.observe(el));


// FILTERING LOGIC
const filterButtons = document.querySelectorAll('.filter-btn');
const showCards = document.querySelectorAll('.show-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.category;

    showCards.forEach((card) => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});
