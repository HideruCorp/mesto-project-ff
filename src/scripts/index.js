import '../pages/index.css';
import { createCard, deleteCard } from './components/card.js';
import { getUserInfo, getInitialCards } from './api.js';
import { openModal, closeModal, setPopupEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './validation.js';

// DOM узлы
const placesCardContainer = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.elements.name;
const jobInput = formEditProfile.elements.description;

const addCardButton = document.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
const formAddCard = document.forms['new-place'];
const placeNameInput = formAddCard.elements['place-name'];
const linkInput = formAddCard.elements.link;

const popupImage = document.querySelector('.popup_type_image');
const popupImagePic = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

const validationConfig = {
  formSelector: '.popup__form',
  input: {
    inputSelector: '.popup__input',
    inputErrorClass: 'popup__input-invalid',
    errorActiveClass: 'popup__input-error_active'
  },
  submitButton: {
    buttonSelector: '.popup__button',
    buttonInactiveClass: 'popup__button_inactive'
  }
};

const userData = {
  _id: ''
};

// Открытие попапов
editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  formEditProfile.reset();
  clearValidation(popupEditProfile, validationConfig);
  openModal(popupEditProfile);
});
addCardButton.addEventListener('click', () => {+
  formAddCard.reset();
  clearValidation(popupAddCard, validationConfig);
  openModal(popupAddCard);
});

setPopupEventListeners(popupEditProfile);
setPopupEventListeners(popupAddCard);
setPopupEventListeners(popupImage);

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
  const cardElement = createCard(cardData, { currentUserId: userData._id, deleteCard, handleImageClick, handleLikeClick });
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

function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfoData, cardsData]) => {
    userData._id = userInfoData._id;

    profileTitle.textContent = userInfoData.name;
    profileDescription.textContent = userInfoData.about;
    cardsData.forEach((cardData) => { 
      const cardElement = createCard(cardData, {deleteCard, handleImageClick, handleLikeClick });
      placesCardContainer.append(cardElement);
     });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных:', err);
  });

enableValidation(validationConfig);
