// scroll.js
export function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const card = carousel.querySelector('.card-barco');

  if (!carousel || !card) return;

  const cardStyle = window.getComputedStyle(card);
  const cardMarginRight = parseInt(cardStyle.marginRight) || 0;
  const cardWidth = card.offsetWidth + cardMarginRight;

  let cardsToScroll;

  const screenWidth = window.innerWidth;

  if (screenWidth >= 992) {
    cardsToScroll = 3.2;
  } else if (screenWidth >= 768) {
    cardsToScroll = 2;
  } else {
    cardsToScroll = 1;
  }

  const scrollAmount = cardWidth * cardsToScroll;

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}
