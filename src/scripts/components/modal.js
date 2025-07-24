function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closeModal(openedPopup);
  }
}

export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

export function setPopupEventListeners(popup) {
  const closeButton = popup.querySelector('.popup__close');
  let isMouseDownInside = false;

  // Закрытие попапов по кнопке закрытия
  closeButton.addEventListener('click', () => closeModal(popup));

  // Предотвращаем восприятие mouseup вне окна за клик по оверлею
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target !== evt.currentTarget) {
      isMouseDownInside = true;
    }
  });

  // Закрытие попапов по клику на оверлей
  popup.addEventListener('click', (evt) => {
    if (evt.target === evt.currentTarget && !isMouseDownInside) {
      closeModal(popup);
    }
    isMouseDownInside = false;
  });
}
