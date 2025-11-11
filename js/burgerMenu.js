export function initBurgerMenu() {
  const burgerMenu = document.querySelector('.header-top__menu-list');
  const burgerButton = document.querySelector('.burger-button');
  const pageBody = document.querySelector('body');
  let isMenuOpen = false;

  function menuOpen() {
    burgerMenu.classList.add('header-top__menu-list--active');
    burgerButton.classList.add('burger-button--active');
    pageBody.classList.add('body--shadow');
    pageBody.style.overflow = 'hidden';
    isMenuOpen = true;
  }
  function menuClose() {
    burgerMenu.classList.remove('header-top__menu-list--active');
    burgerButton.classList.remove('burger-button--active');
    pageBody.classList.remove('body--shadow');
    pageBody.style.overflow = '';
    isMenuOpen = false;
  }
  function toggleMenu() {
    isMenuOpen ? menuClose() : menuOpen();
  }
  
  burgerButton.addEventListener('click', toggleMenu);

  document.addEventListener('click', function (event) {   
    if (isMenuOpen && event.target !== burgerMenu && !event.target.closest('.burger-button')) {
      menuClose();
    }
  });
}