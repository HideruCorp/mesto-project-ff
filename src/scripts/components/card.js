export function createCardNode(cardData, { currentUserId, handleDeleteCardClick, handleImageClick, handleLikeUpdate } = {}) {
  const cardElement = document.getElementById('card-template').content.querySelector('.places__item').cloneNode(true);
  cardElement.dataset.cardId = cardData._id;

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  updateCardLikes(cardElement, cardData, currentUserId);

  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', handleDeleteCardClick);
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener('click', (evt) => handleLikeClick(evt, handleLikeUpdate));
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return cardElement;
}

const handleLikeClick = (evt, handleLikeUpdate) => {
  const cardItem = evt.target.closest('.places__item');
  const likeButton = cardItem.querySelector('.card__like-button');
  const cardId = cardItem.dataset.cardId;
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  handleLikeUpdate(cardId, isLiked, cardItem);
}

export const updateCardLikes = (cardItem, newCardData, userId) => {
  const likeButton = cardItem.querySelector('.card__like-button');
  const likeCounter = cardItem.querySelector('.card__like-counter');
  likeCounter.textContent = newCardData.likes.length;
  const isLiked = newCardData.likes.map(like => like._id).includes(userId);
  likeButton.classList.toggle('card__like-button_is-active', isLiked);
};
