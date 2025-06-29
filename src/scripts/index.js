import '../pages/index.css';
import { initialCards } from './cards';
import { createCard, deleteCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

// DOM узлы
const placesCardContainer = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const closeEditProfileButton = popupEditProfile.querySelector('.popup__close');
const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.elements.name;
const jobInput = formEditProfile.elements.description;

const addCardButton = document.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
const closeAddCardButton = popupAddCard.querySelector('.popup__close');
const formAddCard = document.forms['new-place'];
const placeNameInput = formAddCard.elements['place-name'];
const linkInput = formAddCard.elements.link;

const popupImage = document.querySelector('.popup_type_image');
const popupImagePic = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');
const closeImageButton = popupImage.querySelector('.popup__close');

// Открытие попапов
editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEditProfile);
});
addCardButton.addEventListener('click', () => openModal(popupAddCard));

// Закрытие попапов по кнопке закрытия
closeEditProfileButton.addEventListener('click', () => closeModal(popupEditProfile));
closeAddCardButton.addEventListener('click', () => closeModal(popupAddCard));
closeImageButton.addEventListener('click', () => closeModal(popupImage));

// Закрытие попапов по клику на оверлей
popupEditProfile.addEventListener('click', (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(popupEditProfile);
  }
});

popupAddCard.addEventListener('click', (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(popupAddCard);
  }
});

popupImage.addEventListener('click', (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal(popupImage);
  }
});

// Обработчик формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupEditProfile);
}

formEditProfile.addEventListener('submit', handleProfileFormSubmit);

// Обработчик формы добавления новой карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const cardData = {
    name: placeNameInput.value,
    link: linkInput.value
  };
  const cardElement = createCard(cardData, deleteCard, handleImageClick);
  placesCardContainer.prepend(cardElement);
  evt.target.reset();
  closeModal(popupAddCard);
}

formAddCard.addEventListener('submit', handleAddCardFormSubmit);

function handleImageClick(cardData) {
  popupImagePic.src = cardData.link;
  popupImagePic.alt = cardData.name;
  popupImageCaption.textContent = cardData.name;
  openModal(popupImage);
}

// Вывести карточки на страницу
initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard, handleImageClick);
  placesCardContainer.append(cardElement);
});
