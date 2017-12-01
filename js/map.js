'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_SPIRE_HEIGHT = 18;
var NUMBER_OF_RENTALS = 8;
var CARD_RENDER_NUMBER = 0;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomElement = function (arr) {
  return arr[getRandomNumber(0, arr.length)];
};

var getRandomArray = function (arr) {
  var newArr = [];

  while (newArr.length < arr.length) {
    var randomElement = getRandomElement(arr);

    if (newArr.indexOf(randomElement) !== -1) {
      continue;
    }

    newArr.push(randomElement);
  }

  newArr = newArr.slice(0, getRandomNumber(0, newArr.length));
  return newArr;
};

var createOffer = function (indexOffer) {
  var coordinatesLocation = [getRandomNumber(300, 901), getRandomNumber(100, 501)];
  return {
    'author': {
      'avatar': 'img/avatars/user0' + (indexOffer + 1) + '.png'
    },

    'offer': {
      'title': TITLES[indexOffer],
      'address': coordinatesLocation[0] + ', ' + coordinatesLocation[1],
      'price': getRandomNumber(1000, 1000001),
      'type': getRandomElement(OFFER_TYPES),
      'rooms': getRandomNumber(1, 6),
      'guests': getRandomNumber(1, 10),
      'checkin': getRandomElement(TIMES),
      'checkout': getRandomElement(TIMES),
      'features': getRandomArray(FEATURES),
      'description': '',
      'photos': []
    },

    'location': {
      'x': coordinatesLocation[0],
      'y': coordinatesLocation[1]
    }
  };
};

var addObjects = function (numberOfObjects) {
  var Objects = [];

  for (var i = 0; i < numberOfObjects; i++) {
    Objects.push(createOffer(i));
  }

  return Objects;
};

var listOfRentals = addObjects(NUMBER_OF_RENTALS);

var map = document.querySelector('.map');

var mapListElement = map.querySelector('.map__pins');
var template = document.querySelector('template').content;

var renderMapPin = function (element) {
  var mapPin = template.querySelector('.map__pin').cloneNode(true);
  var mapPinImage = mapPin.querySelector('img');

  mapPin.style.left = element.location.x + 'px';
  mapPin.style.top = element.location.y - (mapPinImage.height / 2 + PIN_SPIRE_HEIGHT) + 'px';
  mapPin.querySelector('img').setAttribute('src', element.author.avatar);

  return mapPin;
};

var renderPopup = function (parent, element) {
  var getValueTypeOffer = function () {
    if (element.offer.type === 'flat') {
      return 'Квартира';
    } else if (element.offer.type === 'bungalo') {
      return 'Бунгало';
    } else {
      return 'Дом';
    }
  };

  var removeChilds = function (topElement) {
    while (topElement.firstChild) {
      topElement.removeChild(topElement.firstChild);
    }
  };

  parent.querySelector('h3').textContent = element.offer.title;
  parent.querySelector('small').textContent = element.offer.address;
  parent.querySelector('.popup__price').innerHTML = element.offer.price + ' &#x20bd;/ночь';
  parent.querySelector('h4').textContent = getValueTypeOffer();
  parent.querySelector('h4').nextElementSibling.textContent = element.offer.rooms + ' для ' + element.offer.guests + ' гостей';
  parent.querySelector('.popup__features').previousElementSibling.textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;

  var featuresList = parent.querySelector('.popup__features');
  removeChilds(featuresList);

  var fragmentFeatures = document.createDocumentFragment();

  for (var i = 0; i < element.offer.features.length; i++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('feature', 'feature--' + element.offer.features[i]);
    fragmentFeatures.appendChild(featureElement);
  }

  featuresList.appendChild(fragmentFeatures);

  parent.querySelector('.popup__features').nextElementSibling.textContent = element.offer.description;
  parent.querySelector('.popup__avatar').setAttribute('src', element.author.avatar);
};

var renderMapCard = function (element) {
  var mapCard = template.querySelector('.map__card').cloneNode(true);

  renderPopup(mapCard, element);

  return mapCard;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < listOfRentals.length; i++) {
  fragment.appendChild(renderMapPin(listOfRentals[i]));
}

fragment.appendChild(renderMapCard(listOfRentals[CARD_RENDER_NUMBER]));

mapListElement.appendChild(fragment);

var noticeForm = document.querySelector('.notice__form');
var noticeFields = noticeForm.querySelectorAll('fieldset');

var disableFieldset = function (elementsForm, disabled) {
  for (i = 0; i < elementsForm.length; i++) {
    if (disabled === true) {
      elementsForm[i].disabled = true;
    } else if (disabled === false) {
      elementsForm[i].disabled = false;
    }
  }
};

var mapPinsSide = mapListElement.querySelectorAll('.map__pin:not(.map__pin--main)');
for (i = 0; i < mapPinsSide.length; i++) {
  mapPinsSide[i].classList.add('hidden');
}

var popup = mapListElement.querySelector('.popup');
popup.classList.add('hidden');

disableFieldset(noticeFields, true);

var mapPinMain = map.querySelector('.map__pin--main');

var mapPinMainMouseUpHandler = function () {
  map.classList.remove('map--faded');

  for (i = 0; i < mapPinsSide.length; i++) {
    mapPinsSide[i].classList.remove('hidden');
  }

  noticeForm.classList.remove('notice__form--disabled');
  disableFieldset(noticeFields, false);
};

mapPinMain.addEventListener('mouseup', mapPinMainMouseUpHandler);

var replacePopup = function (target) {
  for (i = 0; i < listOfRentals.length; i++) {
    if (target.firstChild.getAttribute('src') === listOfRentals[i].author.avatar) {
      renderPopup(popup, listOfRentals[i]);
    }
  }
};

var mapPinSideClickHandler = function (evt) {

  var target = evt.target;

  while (target !== mapListElement) {
    if (target.className === 'map__pin') {
      for (i = 0; i < mapPinsSide.length; i++) {
        mapPinsSide[i].classList.remove('map__pin--active');
      }

      replacePopup(target);

      target.classList.add('map__pin--active');
      popup.classList.remove('hidden');
      break;
    }

    target = target.parentNode;
  }
};

mapListElement.addEventListener('click', mapPinSideClickHandler);

var popupClose = popup.querySelector('.popup__close');

var popupCloseClickHandler = function () {
  popup.classList.add('hidden');
  for (i = 0; i < mapPinsSide.length; i++) {
    mapPinsSide[i].classList.remove('map__pin--active');
  }
};

popupClose.addEventListener('click', popupCloseClickHandler);
