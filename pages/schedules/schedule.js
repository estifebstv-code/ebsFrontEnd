// Fade-in Animation
const elements = document.querySelectorAll('.fade-in');

function reveal() {
  const trigger = window.innerHeight * 0.9;

  elements.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

// Tabs (Today / Week)
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".schedule-section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});
