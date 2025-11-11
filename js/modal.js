export function initModal() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalType = document.getElementById('modal-type');
  const modalBreed = document.getElementById('modal-breed');
  const modalDescription = document.getElementById('modal-description');
  const modalAge = document.getElementById('modal-age');
  const modalInoculations = document.getElementById('modal-inoculations');
  const modalDiseases = document.getElementById('modal-diseases');
  const modalParasites = document.getElementById('modal-parasites');

  const closeModalBtn = document.querySelector('.modal-close');

  function openModal(cardData, page) {
    modal.style.display = "flex";

    let basePath;
    if (page === "main") {
      basePath = "";
    } else if (page === "pets") {
      basePath = "../";
    }    
    
    modalImg.src = basePath + cardData.img;

    modalName.textContent = cardData.name;
    modalType.textContent = cardData.type;
    modalBreed.textContent = cardData.breed;
    modalDescription.textContent = cardData.description;
    modalAge.textContent = cardData.age;
    modalInoculations.textContent = cardData.inoculations;
    modalDiseases.textContent = cardData.diseases;
    modalParasites.textContent = cardData.parasites;

    document.body.classList.add("scroll-block");
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('scroll-block');
  }

  closeModalBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  return openModal;
}