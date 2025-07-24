const showInputError = (formElement, inputElement, { inputErrorClass, errorActiveClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = inputElement.validationMessage || inputElement.dataset.errorMessage;
  errorElement.classList.add(errorActiveClass);
};

const hideInputError = (formElement, inputElement, { inputErrorClass, errorActiveClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  if (errorElement) {
    errorElement.classList.remove(errorActiveClass);
    errorElement.textContent = '';
  }
};

const checkInputValidity = (formElement, inputElement, inputConfig) => {
  if (inputElement.validity.patternMismatch && inputElement.value.length > 0 && inputElement.value.trim().length === 0) {
    inputElement.setCustomValidity(`Поле не может содержать только пробелы`);
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.invalid);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputConfig);
  } else {
    hideInputError(formElement, inputElement, inputConfig);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement, { buttonInactiveClass }) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(buttonInactiveClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(buttonInactiveClass);
    buttonElement.disabled = false;
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.input.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButton.buttonSelector);
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config.input);
      toggleButtonState(inputList, buttonElement, config.submitButton);
    });
  });
};

const preventDefaultCallback = (evt) => {
      evt.preventDefault();
    };

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', preventDefaultCallback);
    setEventListeners(formElement, config);
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.input.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButton.buttonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config.input);
  });

  toggleButtonState(inputList, buttonElement, config.submitButton);
};
