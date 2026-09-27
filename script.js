const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

menu?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}
