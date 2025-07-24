const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-42',
  headers: {
    authorization: 'f9359bef-49f9-43de-be9d-6cc36895394c',
    'Content-Type': 'application/json'
  }
};


const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
};


export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(checkResponse);
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(checkResponse);
};

export const patchUserInfo = ({name, about}) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name,
      about
    })
  })
    .then(checkResponse);
}

export const postNewCard = ({name, link}) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name,
      link
    })
  })
    .then(checkResponse);
}

export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(checkResponse);
}

export const putLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
    .then(checkResponse);
}

export const deleteLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(checkResponse);
}

export const patchUserAvatar = (avatarLink) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarLink
    })
  })
  .then(checkResponse);
}
