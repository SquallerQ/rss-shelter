import { PETS_ARRAY } from './petsData.js';
import { initBurgerMenu } from './burgerMenu.js';
import { initModal } from './modal.js';
const openModal = initModal();

// Burger
initBurgerMenu();

function generateArrays() {
  const mainArray = [];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  function shuffleArray(array) {
    const arrayCopy = [...array];
    // Fisher-Yates algorithm
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = arrayCopy[i];
      arrayCopy[i] = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = temp;
    }
    return arrayCopy;
  }

  function isValidTransition(currentArray, nextArray) {
    const lastTwoFromCurrent = currentArray.slice(-2);
    const firstFourFromNext = nextArray.slice(0, 4);
    for (let i = 0; i < lastTwoFromCurrent.length; i++) {
      if (firstFourFromNext.includes(lastTwoFromCurrent[i])) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < 6; i++) {
    let newArray;
    if (i === 0) {
      newArray = shuffleArray(numbers);
      mainArray.push(newArray);
    } else {
      let isValid = false;
      while (!isValid) {
        newArray = shuffleArray(numbers);
        const previousArray = mainArray[mainArray.length - 1];
        if (isValidTransition(previousArray, newArray)) {
          isValid = true;
        }
      }
      mainArray.push(newArray);
    }
  }
  return mainArray;
}
const result = generateArrays();
const allCards = result.flat();

let currentPage = 1;
let cardsPerPage = 8;
let totalPages = 6;

const petsCardsContainer = document.querySelector('.pets__cards');
const prevBtn = document.querySelector('.pets__pagination-item--previous');
const firstPageBtn = document.querySelector('.pets__pagination-item--first');
const counterBtn = document.querySelector('.pets__pagination-item--counter');
const nextBtn = document.querySelector('.pets__pagination-item--next');
const lastPageBtn = document.querySelector('.pets__pagination-item--last');

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCards();
    updatePagination();
  }
});
firstPageBtn.addEventListener('click', () => {
  currentPage = 1;
  renderCards();
  updatePagination();
});
nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderCards();
    updatePagination();
  }
});
lastPageBtn.addEventListener('click', () => {
  currentPage = totalPages;
  renderCards();
  updatePagination();
});
function updatePagination() {
  counterBtn.textContent = currentPage;
  firstPageBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastPageBtn.disabled = currentPage === totalPages;

  if (currentPage > 1) {
    firstPageBtn.classList.remove('btn__disabled');
    firstPageBtn.classList.add('btn__enabled');
    prevBtn.classList.remove('btn__disabled');
    prevBtn.classList.add('btn__enabled');
  } else if (currentPage === 1) {
    firstPageBtn.classList.remove('btn__enabled');
    firstPageBtn.classList.add('btn__disabled');
    prevBtn.classList.remove('btn__enabled');
    prevBtn.classList.add('btn__disabled');
  }
  if (currentPage === totalPages) {
    lastPageBtn.classList.add('btn__disabled');
    lastPageBtn.classList.remove('btn__enabled');
    nextBtn.classList.remove('btn__enabled');
    nextBtn.classList.add('btn__disabled');
  } else {
    lastPageBtn.classList.remove('btn__enabled');
    lastPageBtn.classList.add('btn__enabled');
    nextBtn.classList.remove('btn__disabled');
    nextBtn.classList.add('btn__enabled');
  }
}

function renderCards() {
  petsCardsContainer.innerHTML = '';

  const startIdx = (currentPage - 1) * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const currentCards = allCards.slice(startIdx, endIdx);

  currentCards.forEach((cardNumber) => {
    const cardData = PETS_ARRAY[cardNumber - 1];

    let element = document.createElement('div');
    element.className = 'pets__card';
    element.innerHTML = `
              <img src='../${cardData.img}' alt='pets image' class='pets__image'>
              <p class='pets__text'>${cardData.name}</p>
              <button class='pets__button'>Learn more</button>`;
    petsCardsContainer.append(element);
  });
}

function cardsOnPage() {
  const width = document.body.clientWidth;
  if (width > 768) {
    totalPages = 6;
    cardsPerPage = 8;
  } else if (width > 320) {
    totalPages = 8;
    cardsPerPage = 6;
  } else if (width <= 320) {
    totalPages = 16;
    cardsPerPage = 3;
  }
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  updatePagination();
  renderCards();
}
window.addEventListener('resize', cardsOnPage);
cardsOnPage();

petsCardsContainer.addEventListener('click', function (event) {
  let card = event.target.closest('.pets__card');

  if (card) {
    const cardIndex = Array.from(petsCardsContainer.children).indexOf(card);
    const startIdx = (currentPage - 1) * cardsPerPage;
    const cardNumber = allCards[startIdx + cardIndex];
    const cardData = PETS_ARRAY[cardNumber - 1];

    openModal(cardData, "pets");
  }
});
