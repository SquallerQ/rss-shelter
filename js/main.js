import { PETS_ARRAY } from './petsData.js'
import { initBurgerMenu } from './burgerMenu.js'
import { initModal } from './modal.js';

// Has access to closeModal thanks to closure
const openModal = initModal();

// Burger
initBurgerMenu();

// Slider
const cardsContainer = document.querySelector(".pets__slider-cards");
const buttonRight = document.querySelector(".pets__slider-arrow--right");
const buttonLeft = document.querySelector(".pets__slider-arrow--left");

let allPetsArray = PETS_ARRAY.map((element) => element);

let cardsOnScreen = [];
let historyRight = [];
let historyLeft = [];

function renderCards(numberOfSlides, array, clearScreen = false, fromHistory = false) {
  if (clearScreen === true || fromHistory === true) {
    const cardsFromPage = document.querySelectorAll(".pets__slider-card");
    cardsFromPage.forEach(function (item) {
      item.style.display = "none";
    });
  }

  let selectedCards = [];
  if (fromHistory === false) {
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
  } else {
    selectedCards = array;
  }

  selectedCards = selectedCards.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  for (let i = 0; i < selectedCards.length; i++) {
    let element = document.createElement('div');
    element.className = 'pets__slider-card';
    element.innerHTML = `
                  <img src='${selectedCards[i].img}' alt='slider image' class='pets__slider-image'>
                  <p class='pets__slider-text'>${selectedCards[i].name}</p>
                  <button class='pets__slider-button'>Learn more</button>`;
    element.addEventListener('click', () => {
      openModal(selectedCards[i], "main");
    });
    cardsContainer.append(element);
  }

  return selectedCards;
}

function getAvailableCards() {
  return allPetsArray.filter((item) => !cardsOnScreen.includes(item));
}

// Renders cards and updates state simultaneously
cardsOnScreen = renderCards(3, allPetsArray);

buttonRight.addEventListener("click", function () {
  if (historyLeft.length > 0) {
    historyRight.push([...cardsOnScreen]);
    cardsOnScreen = historyLeft.pop();
    renderCards(0, cardsOnScreen, true, true);
  } else {
    historyRight.push([...cardsOnScreen]);
    let availableCards = getAvailableCards();
    // Renders cards and updates state simultaneously
    cardsOnScreen = renderCards(3, availableCards, true);
  }
});

buttonLeft.addEventListener("click", function () {
  if (historyRight.length > 0) {
    historyLeft.push([...cardsOnScreen]);
    cardsOnScreen = historyRight.pop();
    renderCards(0, cardsOnScreen, true, true);
  } else {
    historyLeft.push([...cardsOnScreen]);
    let availableCards = getAvailableCards();
    // Renders cards and updates state simultaneously
    cardsOnScreen = renderCards(3, availableCards, true);
  }
});