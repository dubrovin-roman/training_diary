"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      const myCoordinates = [latitude, longitude];
      ymaps.ready(init);
      function init() {
        // Создание карты.
        const myMap = new ymaps.Map("map", {
          // Координаты центра карты.
          // Порядок по умолчанию: «широта, долгота».
          // Чтобы не определять координаты центра карты вручную,
          // воспользуйтесь инструментом Определение координат.
          center: myCoordinates,
          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 13,
        });
        const myPosition = new ymaps.GeoObject({
          geometry: {
            type: "Point", // тип геометрии - точка
            coordinates: myCoordinates, // координаты точки
          },
        });
        myMap.geoObjects.add(myPosition);
        myMap.events.add("click", (mapEvent) => {
          const coords = mapEvent.get("coords");
          const tempBalloon = new ymaps.Placemark(
            coords,
            {
              iconContent: "Тренировка № 1",
              balloonContentHeader: "Тренировка № 1",
              balloonContentBody: "Содержимое тренировки",
            },
            {
              preset: "islands#darkGreenStretchyIcon",
            }
          );
          myMap.geoObjects.add(tempBalloon);
        });
      }
    },
    function () {
      alert("Вы не предоставили свою геопозицию");
    }
  );
}
