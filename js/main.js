import { PETS_ARRAY } from './petsData.js'
import { initBurgerMenu } from './burgerMenu.js'
import { initModal } from './modal.js';

// Has access to closeModal thanks to closure
const openModal = initModal();

// Burger
initBurgerMenu();

// Slider
const track = document.querySelector(".pets__slider-track");
const buttonRight = document.querySelector(".pets__slider-arrow--right");
const buttonLeft = document.querySelector(".pets__slider-arrow--left");

let allPetsArray = PETS_ARRAY.map((element) => element);

let cardsOnScreen = [];
let historyRight = [];
let historyLeft = [];
let isAnimating = false;
let previousCardsCount = 0;

function getVisibleCardsCount() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
    return 1;
  } else if (screenWidth <= 1100) {
    return 2;
  } else {
    return 3;
  }
}

function getCurrentGap() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
    return 0;
  } else if (screenWidth <= 1100) {
    return 40;
  } else if (screenWidth <= 1280) {
    return 60;
  } else {
    return 90;
  }
}

function generateRandomCards(numberOfSlides, array) {
  let selectedCards = [];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  for (let i = 0; i < numberOfSlides; i++) {
    let randomNumber = getRandomInt(array.length);
    if (!selectedCards.includes(array[randomNumber])) {
      selectedCards.push(array[randomNumber]);
    } else {
      i = i - 1;
    }
  }

  return selectedCards.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

function createCardElement(cardData) {
  let element = document.createElement("div");
  element.className = "pets__slider-card";
  element.innerHTML = `
    <img src='${cardData.img}' alt='slider image' class='pets__slider-image'>
    <p class='pets__slider-text'>${cardData.name}</p>
    <button class='pets__slider-button'>Learn more</button>`;
  element.addEventListener("click", () => {
    openModal(cardData, "main");
  });
  return element;
}

function renderCards(numberOfSlides, array) {
  let selectedCards = generateRandomCards(numberOfSlides, array);

  track.innerHTML = "";
  selectedCards.forEach((cardData) => {
    track.append(createCardElement(cardData));
  });

  return selectedCards;
}

function getAvailableCards() {
  return allPetsArray.filter((item) => !cardsOnScreen.includes(item));
}

previousCardsCount = getVisibleCardsCount();
cardsOnScreen = renderCards(previousCardsCount, allPetsArray);

function slideCards(newCards, direction) {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    const oldCard = track.firstChild;
    const newCard = createCardElement(newCards[0]);

    if (oldCard) {
      track.replaceChild(newCard, oldCard);
    } else {
      track.appendChild(newCard);
    }

    isAnimating = false;
    return;
  }

  const cardWidth = 270;
  const gap = getCurrentGap();
  const visibleCount = getVisibleCardsCount();
  const slideDistance = (cardWidth + gap) * visibleCount;

  if (direction === "right") {
    newCards.forEach((cardData) => {
      track.appendChild(createCardElement(cardData));
    });

    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = `translateX(-${slideDistance}px)`;

    setTimeout(() => {
      for (let i = 0; i < visibleCount; i++) {
        track.firstChild.remove();
      }
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      void track.offsetWidth;
      isAnimating = false;
    }, 600);
  } else {
    newCards.reverse().forEach((cardData) => {
      track.insertBefore(createCardElement(cardData), track.firstChild);
    });

    track.style.transition = "none";
    track.style.transform = `translateX(-${slideDistance}px)`;
    void track.offsetWidth;

    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = "translateX(0)";

    setTimeout(() => {
      for (let i = 0; i < visibleCount; i++) {
        track.lastChild.remove();
      }
      isAnimating = false;
    }, 600);
  }
}

buttonRight.addEventListener("click", function () {
  if (isAnimating) return;
  isAnimating = true;

  let newCards;
  const visibleCount = getVisibleCardsCount();

  if (historyLeft.length > 0) {
    historyRight.push([...cardsOnScreen]);
    newCards = historyLeft.pop();
  } else {
    historyRight.push([...cardsOnScreen]);
    let availableCards = getAvailableCards();
    newCards = generateRandomCards(visibleCount, availableCards);
  }

  slideCards(newCards, "right");
  cardsOnScreen = newCards;
});

buttonLeft.addEventListener("click", function () {
  if (isAnimating) return;
  isAnimating = true;

  let newCards;
  const visibleCount = getVisibleCardsCount();

  if (historyRight.length > 0) {
    historyLeft.push([...cardsOnScreen]);
    newCards = historyRight.pop();
  } else {
    historyLeft.push([...cardsOnScreen]);
    let availableCards = getAvailableCards();
    newCards = generateRandomCards(visibleCount, availableCards);
  }

  slideCards(newCards, "left");
  cardsOnScreen = newCards;
});

window.addEventListener("resize", function () {
  const currentCardsCount = getVisibleCardsCount();

  if (currentCardsCount !== previousCardsCount) {
    previousCardsCount = currentCardsCount;
    historyRight = [];
    historyLeft = [];
    cardsOnScreen = renderCards(currentCardsCount, allPetsArray);
  }
});