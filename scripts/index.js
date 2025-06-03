// Темплейт карточки
const cardTemplate = document.getElementById('card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');
const placesItem = cardTemplate.querySelector('.places__item');

// Функция создания карточки
function createCard(cardData, deleteCallback) {
  const cardElement = placesItem.cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', deleteCallback);

  return cardElement;
}

// Функция удаления карточки
const deleteCard = function (event) {
  const cardItem = event.target.closest('.places__item');
  cardItem.remove();
};

// Вывести карточки на страницу
initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
