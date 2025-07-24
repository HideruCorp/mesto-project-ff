import '../pages/index.css';
import { createCardNode, updateCardLikes } from './components/card.js';
import { getUserInfo, getInitialCards, patchUserInfo, postNewCard, deleteCard, putLike, deleteLike, patchUserAvatar } from './components/api.js';
import { openModal, closeModal, setPopupEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

// DOM узлы
const placesCardContainer = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImageContainer = document.querySelector('.profile__image-container');
const profileImage = profileImageContainer.querySelector('.profile__image');

const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const formEditAvatar = document.forms['edit-avatar'];
const avatarLinkInput = formEditAvatar.elements.avatar;
const avatarFormSubmitButton = formEditAvatar.querySelector('.popup__button');

const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.elements.name;
const jobInput = formEditProfile.elements.description;
const profileFormSubmitButton = formEditProfile.querySelector('.popup__button');

const addCardButton = document.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
const formAddCard = document.forms['new-place'];
const placeNameInput = formAddCard.elements['place-name'];
const linkInput = formAddCard.elements.link;
const addCardFormSubmitButton = formAddCard.querySelector('.popup__button');

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
  formEditProfile.reset();
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(popupEditProfile, validationConfig);
  openModal(popupEditProfile);
});
addCardButton.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(popupAddCard, validationConfig);
  openModal(popupAddCard);
});

profileImageContainer.addEventListener('click', () => {
    formEditAvatar.reset();
    clearValidation(popupEditAvatar, validationConfig);
    openModal(popupEditAvatar);
});

setPopupEventListeners(popupEditProfile);
setPopupEventListeners(popupAddCard);
setPopupEventListeners(popupImage);
setPopupEventListeners(popupEditAvatar);

// Обработчик формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const originalButtonText = profileFormSubmitButton.textContent;
  profileFormSubmitButton.disabled = true;
  profileFormSubmitButton.textContent = 'Сохранение...';

  patchUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((updatedUserInfo) => {
      profileTitle.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closeModal(popupEditProfile);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      profileFormSubmitButton.disabled = false;
      profileFormSubmitButton.textContent = originalButtonText;
    });
}

formEditProfile.addEventListener('submit', handleProfileFormSubmit);

// Обработчик формы обновления аватара
function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();
    const originalButtonText = avatarFormSubmitButton.textContent;
    avatarFormSubmitButton.disabled = true;
    avatarFormSubmitButton.textContent = 'Сохранение...';

    patchUserAvatar(avatarLinkInput.value)
        .then((updatedUserInfo) => {
            profileImage.src = updatedUserInfo.avatar;
            closeModal(popupEditAvatar);
        })
        .catch((err) => {
            console.error('Ошибка при обновлении аватара:', err);
        })
        .finally(() => {
            avatarFormSubmitButton.disabled = false;
            avatarFormSubmitButton.textContent = originalButtonText;
        });
}

formEditAvatar.addEventListener('submit', handleEditAvatarFormSubmit);

// Обработчик формы добавления новой карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const originalButtonText = addCardFormSubmitButton.textContent;
  addCardFormSubmitButton.disabled = true;
  addCardFormSubmitButton.textContent = 'Сохранение...';

  const cardData = {
    name: placeNameInput.value,
    link: linkInput.value
  };

  postNewCard(cardData)
    .then((newCardData) => {
      const cardElement = createCardNode(newCardData, { currentUserId: userData._id, handleDeleteCardClick, handleImageClick, handleLikeUpdate });
      placesCardContainer.prepend(cardElement);
      formAddCard.reset();
      closeModal(popupAddCard);
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      addCardFormSubmitButton.disabled = false;
      addCardFormSubmitButton.textContent = originalButtonText;
    });
}

formAddCard.addEventListener('submit', handleAddCardFormSubmit);

function handleImageClick(cardData) {
  popupImagePic.src = cardData.link;
  popupImagePic.alt = cardData.name;
  popupImageCaption.textContent = cardData.name;
  openModal(popupImage);
}

function handleLikeUpdate(cardId, isLiked, cardElement) {
  const likeAction = isLiked ? deleteLike(cardId) : putLike(cardId);

  likeAction
    .then((newCardData) => {
      updateCardLikes(cardElement, newCardData, userData._id);
    })
    .catch((err) => {
      console.error('Ошибка при изменении состояния лайка:', err);
    });
}

function handleDeleteCardClick(evt, cardId) {
  const cardItem = evt.target.closest('.places__item');

  deleteCard(cardId)
    .then(() => {
      cardItem.remove();
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    });
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfoData, cardsData]) => {
    userData._id = userInfoData._id;

    profileTitle.textContent = userInfoData.name;
    profileDescription.textContent = userInfoData.about;
    profileImage.src = userInfoData.avatar;
    
    cardsData.forEach((cardData) => {
      const cardElement = createCardNode(cardData, { currentUserId: userData._id, handleDeleteCardClick, handleImageClick, handleLikeUpdate });
      placesCardContainer.append(cardElement);
     });
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных:', err);
  });

enableValidation(validationConfig);
