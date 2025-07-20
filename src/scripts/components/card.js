export function createCard(cardData, { currentUserId, deleteCard, handleImageClick, handleLikeClick } = {}) {
  const cardElement = document.getElementById('card-template').content.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  const cardIsLiked = cardData.likes.map(like => like._id).includes(currentUserId);
  likeButton.classList.toggle('card__like-button_is-active', cardIsLiked);

  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', deleteCard);
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener('click', handleLikeClick);
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return cardElement;
}

export const deleteCard = function (event) {
  const cardItem = event.target.closest('.places__item');
  cardItem.remove();
};
