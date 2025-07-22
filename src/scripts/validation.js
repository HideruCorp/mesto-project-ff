const urlValidationCache = new Map();

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const showInputError = (formElement, inputElement, { inputErrorClass, errorActiveClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = inputElement.validationMessage || inputElement.dataset.errorMessage || 'Неизвестная ошибка';
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

const validateImageMimeType = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return false;
    }
    const contentType = response.headers.get('Content-Type');
    return contentType && contentType.startsWith('image/');
  } catch (error) {
    console.error('Ошибка при проверке MIME-типа:', error);
    return false;
  }
};

// Функция для асинхронной валидации URL изображений
const validateImageInput = (formElement, inputElement, config) => {
  const url = inputElement.value.trim();
  const inputList = Array.from(formElement.querySelectorAll(config.input.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButton.buttonSelector);

  // Если URL пустой или поле невалидно по другим причинам, пропускаем асинхронную проверку
  if (!url || inputElement.validity.typeMismatch || inputElement.validity.valueMissing) {
    inputElement.setCustomValidity("");
    return Promise.resolve();
  }

  // Проверяем кэш
  const cachedResult = urlValidationCache.get(url);
  if (cachedResult !== undefined) {
    const errorMessage = cachedResult ? "" : (inputElement.dataset.errorMessage || "URL не ведет на изображение");
    inputElement.setCustomValidity(errorMessage);
    
    if (!cachedResult) {
      showInputError(formElement, inputElement, config.input);
    } else {
      hideInputError(formElement, inputElement, config.input);
    }
    
    toggleButtonState(inputList, buttonElement, config.submitButton);
    return Promise.resolve(cachedResult);
  }

  // Блокируем кнопку на время проверки
  buttonElement.disabled = true;
  buttonElement.classList.add(config.submitButton.buttonInactiveClass);

  return validateImageMimeType(url)
    .then(isValid => {
      // Кэшируем результат
      urlValidationCache.set(url, isValid);
      
      const errorMessage = isValid ? "" : (inputElement.dataset.errorMessage || "URL не ведет на изображение");
      inputElement.setCustomValidity(errorMessage);
      
      if (!isValid) {
        showInputError(formElement, inputElement, config.input);
      } else {
        hideInputError(formElement, inputElement, config.input);
      }
      
      return isValid;
    })
    .catch(() => {
      // При ошибке сети считаем URL невалидным
      urlValidationCache.set(url, false);
      const errorMessage = inputElement.dataset.errorMessage || "Ошибка проверки URL";
      inputElement.setCustomValidity(errorMessage);
      showInputError(formElement, inputElement, config.input);
      return false;
    })
    .finally(() => {
      // Обновляем состояние кнопки после проверки
      toggleButtonState(inputList, buttonElement, config.submitButton);
    });
};

// Создаем debounced версию функции
const debouncedValidateImageInput = debounce(validateImageInput, 500);

const checkInputValidity = (formElement, inputElement, inputConfig) => {
  if (inputElement.validity.patternMismatch && inputElement.value.length > 0 && inputElement.value.trim().length === 0) {
    inputElement.setCustomValidity(`Поле не может содержать только пробелы`);
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.invalid);
  } else if (inputElement.validity.tooShort) {
    inputElement.setCustomValidity(`Не менее ${inputElement.minLength} символов`);
  } else if (inputElement.validity.tooLong) {
    inputElement.setCustomValidity(`Не более ${inputElement.maxLength} символов`);
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
      
      // Проверяем, является ли это полем для URL изображения
      if (inputElement.type === 'url' && inputElement.classList.contains('popup__input_type_url--image')) {
        debouncedValidateImageInput(formElement, inputElement, config);
      } else {
        // Для обычных полей сразу обновляем состояние кнопки
        toggleButtonState(inputList, buttonElement, config.submitButton);
      }
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
