// Темна тема
const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme")
})

// Активна кнопка навігації
document.querySelectorAll('.article-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.article-link').forEach(l => l.classList.remove('focused'));
    link.classList.add('focused');
  });
});

const container = document.querySelector('.img-container');
const carousel = container.querySelector('.carousel');
const prevButton = document.querySelector('.past-slide');
const nextButton = document.querySelector('.next-slide');

// Центрування активного зображення
function getCenterImage() {
  const containerRect = container.getBoundingClientRect();
  const imgs = container.querySelectorAll('img');

  let closestImg = null;
  let closestDistance = Infinity;

  imgs.forEach(img => {
    const imgRect = img.getBoundingClientRect();
    const imgCenter = imgRect.left + imgRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;

    const distance = Math.abs(imgCenter - containerCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestImg = img;
    }
  });

  imgs.forEach(img => img.classList.remove('active-img'));
  if (closestImg) closestImg.classList.add('active-img');
}

// Клонуємо крайні зображення
let imgs = carousel.querySelectorAll('img');
const firstClone = imgs[0].cloneNode(true);
const lastClone = imgs[imgs.length - 1].cloneNode(true);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

carousel.appendChild(firstClone);
carousel.insertBefore(lastClone, imgs[0]);

// Оновлюємо список зображень і ширину
imgs = carousel.querySelectorAll('img');
const imageWidth = imgs[0].offsetWidth + 60; // 60 — це gap між зображеннями

// Початковий scroll на перше реальне зображення
carousel.scrollLeft = imageWidth;

// Кнопки навігації
prevButton.addEventListener('click', () => {
  carousel.scrollBy({
    left: -imageWidth,
    behavior: 'smooth'
  });
});

nextButton.addEventListener('click', () => {
  carousel.scrollBy({
    left: imageWidth,
    behavior: 'smooth'
  });
});

// Прокрутка вручну — оновлення активного
carousel.addEventListener('scroll', () => {
  const scrollLeft = carousel.scrollLeft;
  const scrollWidth = carousel.scrollWidth;
  const containerWidth = carousel.offsetWidth;

  // Якщо дійшли до останнього клону — перемотка на початок
  if (scrollLeft >= scrollWidth - containerWidth - imageWidth) {
    carousel.scrollLeft = imageWidth;
  }

  // Якщо дійшли до першого клону — перемотка на кінець
  if (scrollLeft <= 0) {
    carousel.scrollLeft = scrollWidth - 2 * imageWidth;
  }

  requestAnimationFrame(getCenterImage);
});

// Wheel scroll
let isScrolling = false;
carousel.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isScrolling) return;

  isScrolling = true;
  const direction = e.deltaY > 0 ? 1 : -1;

  carousel.scrollBy({
    left: direction * imageWidth,
    behavior: 'smooth'
  });

  setTimeout(() => {
    isScrolling = false;
  }, 400);
});

window.addEventListener('load', getCenterImage);
