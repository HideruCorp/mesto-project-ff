export function createCard(cardData, { deleteCard, handleImageClick, handleLikeClick } = {}) {
  const cardElement = document.getElementById('card-template').content.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', deleteCard);
  likeButton.addEventListener('click', handleLikeClick);
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return cardElement;
}

export const deleteCard = function (event) {
  const cardItem = event.target.closest('.places__item');
  cardItem.remove();
};
