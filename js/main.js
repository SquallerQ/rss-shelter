import { PETS_ARRAY } from './petsData.js'
import { initBurgerMenu } from './burgerMenu.js'
import { initModal } from './modal.js';

// Has access to closeModal thanks to closure
const openModal = initModal();

// Burger
initBurgerMenu();

// Slider
let counterRight = 0;
let counterLeft = 0;

let previousStateOnScreen = [];
let arrayForLastTwoCards = [];

let prevLeftArray = [];
let prevRightArray = [];

let prevL = false
let prevR = false

const cardsContainer = document.querySelector('.pets__slider-cards')
let GlobalArrayCopyForSlider = PETS_ARRAY.map((element) => element);

function renderCards (numberOfSlides, array, clearScreen = false, useExactArray = false) {
  if (clearScreen === true || useExactArray === true) {
    const cardsFromPage = document.querySelectorAll(".pets__slider-card");
    cardsFromPage.forEach(function (item) {
      item.style.display = "none";
    });
  }

  let newArrayForThreeCards = [];
  if (useExactArray === false) {
    newArrayForThreeCards = [];
    
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    
    for (let i = 0; i < numberOfSlides; i++) {
      let randomNumber = getRandomInt(array.length);
      if (!newArrayForThreeCards.includes(array[randomNumber])) {
        newArrayForThreeCards.push(array[randomNumber]);
      } else {
        i = i - 1;
      }
    }
  } else {
    newArrayForThreeCards = array;
  }

  newArrayForThreeCards = newArrayForThreeCards.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  for (let i = 0; i < newArrayForThreeCards.length; i++) {
    let element = document.createElement('div');
    element.className = 'pets__slider-card';
    element.innerHTML = `
                  <img src='${newArrayForThreeCards[i].img}' alt='slider image' class='pets__slider-image'>
                  <p class='pets__slider-text'>${newArrayForThreeCards[i].name}</p>
                  <button class='pets__slider-button'>Learn more</button>`;
    element.addEventListener('click', () => {
      openModal(newArrayForThreeCards[i], "main");
    });
    cardsContainer.append(element);
  }

  if (useExactArray === false && clearScreen === false) {
    previousStateOnScreen.push(...newArrayForThreeCards);
    return GlobalArrayCopyForSlider.filter((item) => !newArrayForThreeCards.includes(item));
  } else if (useExactArray === false && clearScreen === true) {
    array = array.filter((item) => !newArrayForThreeCards.includes(item));
    arrayForLastTwoCards.push(...array);
  }
}
// 5 Cards (8 - 3 (on Screen) = 5)
let modifiedArrayAfterRender = renderCards(3, GlobalArrayCopyForSlider);
// Array for 2 Cards after click. 8-3-3=2 (3 on Screen) (3 on screen after click)

const buttonRight = document.querySelector('.pets__slider-arrow--right');
const buttonLeft = document.querySelector('.pets__slider-arrow--left');

function lastThreeCardsRender (arrayWithEightCards, arrayWithFiveCards) {
  let newThreeCards = arrayWithEightCards.filter((item) => !arrayWithFiveCards.includes(item));
  let newFiveCards = arrayWithEightCards.filter((item) => !newThreeCards.includes(item));

  let resultArray = []
  resultArray.push(newThreeCards);
  resultArray.push(newFiveCards);

  return resultArray;
}

buttonRight.addEventListener('click', function () {
  let twoArrays = lastThreeCardsRender(GlobalArrayCopyForSlider, modifiedArrayAfterRender);
  
  if (counterLeft == 0 && counterRight == 0) {
    renderCards(3, twoArrays[1], true);

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);

    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []

  }
  if (counterLeft > 0 && counterRight == 0) {
    if (prevR == true) {
      renderCards(0, prevRightArray, false, true);  
    }
    if (prevR == false) {
      renderCards(0, previousStateOnScreen, false, true);
      prevRightArray.push(...previousStateOnScreen)
      previousStateOnScreen = [];
      previousStateOnScreen.push(...twoArrays[0])
      prevR = true     
    }
  }
  if (prevR == false && counterLeft == 0 && counterRight > 0) {
    renderCards(3, twoArrays[1], true);

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);


    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []
  }
  if (prevR == true && counterLeft == 0 && counterRight > 0) {
    modifiedArrayAfterRender = GlobalArrayCopyForSlider.filter((item) => !prevRightArray.includes(item))
    twoArrays = lastThreeCardsRender(GlobalArrayCopyForSlider, modifiedArrayAfterRender);    

    renderCards(3, twoArrays[1], true);
    prevLeftArray = [];
    prevRightArray = [];
    prevL = false;
    prevR = false;

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);

    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []
  }

  counterRight++;
  counterLeft = 0;
});

buttonLeft.addEventListener('click', function () {
  let twoArrays = lastThreeCardsRender(GlobalArrayCopyForSlider, modifiedArrayAfterRender);
  if (counterLeft == 0 && counterRight == 0) {
    renderCards(3, twoArrays[1], true);

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);

    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []
  }
  if (counterRight > 0 && counterLeft == 0) {
    if (prevL == true) {
      renderCards(0, prevLeftArray, false, true);
    }
    if (prevL == false) {
      renderCards(0, previousStateOnScreen, false, true);
      prevLeftArray.push(...previousStateOnScreen)
      previousStateOnScreen = [];
      previousStateOnScreen.push(...twoArrays[0])
      prevL = true
    }
  }
  if (prevL == false && counterRight == 0 && counterLeft > 0) {
    renderCards(3, twoArrays[1], true);

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);

    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []
  }
  if (prevL == true && counterRight == 0 && counterLeft > 0) {
    modifiedArrayAfterRender = GlobalArrayCopyForSlider.filter((item) => !prevLeftArray.includes(item))
    twoArrays = lastThreeCardsRender(GlobalArrayCopyForSlider, modifiedArrayAfterRender);   

    renderCards(3, twoArrays[1], true);
    prevLeftArray = [];
    prevRightArray = [];
    prevL = false;
    prevR = false;

    previousStateOnScreen = []
    previousStateOnScreen.push(...twoArrays[0]);

    modifiedArrayAfterRender = [];
    modifiedArrayAfterRender = twoArrays[0].concat(arrayForLastTwoCards);
    arrayForLastTwoCards = []
  }
    counterLeft++;
    counterRight = 0;
});
