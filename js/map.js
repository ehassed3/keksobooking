'use strict';

(function () {
  var CARD_RENDER_NUMBER = 0;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');
  var mapListElement = map.querySelector('.map__pins');

  var createMapElements = function (arrObjects) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrObjects.length; i++) {
      fragment.appendChild(window.pin.renderMapPin(arrObjects[i]));
    }

    fragment.appendChild(window.card.renderMapCard(arrObjects[CARD_RENDER_NUMBER]));

    mapListElement.appendChild(fragment);
  };

  createMapElements(window.data.listOfRentals);

  var popup = mapListElement.querySelector('.popup');
  var mapPinMain = map.querySelector('.map__pin--main');
  mapListElement.insertBefore(popup, mapPinMain);
  popup.classList.add('hidden');

  var mapPinsSide = mapListElement.querySelectorAll('.map__pin:not(.map__pin--main)');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFields = noticeForm.querySelectorAll('fieldset');

  window.map = {
    openPage: function () {
      map.classList.remove('map--faded');

      for (var i = 0; i < mapPinsSide.length; i++) {
        mapPinsSide[i].classList.remove('hidden');
      }

      noticeForm.classList.remove('notice__form--disabled');
      window.form.disableFieldset(noticeFields, false);
    },

    getAddressGeneralPin: function () {
      var inputAddress = noticeForm.querySelector('#address');

      inputAddress.value = 'mock address';
    },

    replacePopup: function (target) {
      for (var i = 0; i < window.data.listOfRentals.length; i++) {
        if (target.firstChild.getAttribute('src') === window.data.listOfRentals[i].author.avatar) {
          window.card.renderPopup(popup, window.data.listOfRentals[i]);
        }
      }
    },

    onPopupEscPress: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.map.closePopup(evt);
      }
    },

    openPopup: function (evt) {
      var target = evt.target;

      while (target !== mapListElement) {
        if (target.className === 'map__pin') {
          for (var i = 0; i < mapPinsSide.length; i++) {
            mapPinsSide[i].classList.remove('map__pin--active');
          }

          target.classList.add('map__pin--active');
          popup.classList.remove('hidden');

          window.map.replacePopup(target);

          document.addEventListener('keydown', window.map.onPopupEscPress);

          break;
        }

        target = target.parentNode;
      }

      var popupClosingElement = popup.querySelector('.popup__close');

      popupClosingElement.addEventListener('click', function () {
        window.map.closePopup();
      });

      popupClosingElement.addEventListener('keydown', function () {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.map.closePopup(evt);
        }
      });
    },

    closePopup: function () {
      popup.classList.add('hidden');
      for (var i = 0; i < mapPinsSide.length; i++) {
        mapPinsSide[i].classList.remove('map__pin--active');
      }
    }
  };
})();
