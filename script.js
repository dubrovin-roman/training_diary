"use strict";

import { Running, Cycling } from "./workout.js";

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

class TrainingDiaryApp {
  _workouts = [];
  _myMap;
  _mapEvent;

  constructor() {
    inputType.addEventListener(
      "change",
      this._changingFormWhenSwitchingTypeOfTraining
    );
    form.addEventListener("submit", this._submittingForm.bind(this));
  }

  initApp() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert("Вы не предоставили свою геопозицию")
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const myCoordinates = [latitude, longitude];
    ymaps.ready(init.bind(this));
    function init() {
      this._myMap = new ymaps.Map("map", {
        center: myCoordinates,
        zoom: 13,
      });
      this._myMap.events.add("click", this._showForm.bind(this));
    }
  }

  _showForm(ev) {
    this._mapEvent = ev;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hiddenForm() {
    form.classList.add("hidden");
  }

  _submittingForm(ev) {
    ev.preventDefault();
    //получаем координаты из mapEvent
    const coords = this._mapEvent.get("coords");
    //получаем данные из форм и валидируем их
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    //функции для валидации
    const isAllPositive = (...inputs) => inputs.every((value) => value > 0);
    const isAllNumber = (...inputs) =>
      inputs.every((value) => Number.isFinite(value));

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !isAllNumber(distance, duration, cadence) ||
        !isAllPositive(distance, duration, cadence)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }
      workout = new Running(coords, distance, duration, cadence);
    }

    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !isAllNumber(distance, duration, elevation) ||
        !isAllPositive(distance, duration)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }
      workout = new Cycling(coords, distance, duration, elevation);
    }
    //складываем все тренировки в один массив
    this._workouts.push(workout);
    //отрисовка тренировки на карте
    this._renderingWorkoutOnMap(workout);

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    //скрываем форму ввода
    this._hiddenForm();
  }

  _renderingWorkoutOnMap(workout) {
    const tempBalloon = new ymaps.Placemark(
      workout.coord,
      {
        iconContent: "Тренировка № 1",
        balloonContentHeader: "Тренировка № 1",
        balloonContentBody: "Содержимое тренировки",
      },
      {
        preset: "islands#darkGreenStretchyIcon",
      }
    );
    this._myMap.geoObjects.add(tempBalloon);
  }

  _changingFormWhenSwitchingTypeOfTraining() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }
}

const app = new TrainingDiaryApp();
app.initApp();
/*
let myMap;
let mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      const myCoordinates = [latitude, longitude];
      ymaps.ready(init);
      function init() {
        // Создание карты.
        myMap = new ymaps.Map("map", {
          // Координаты центра карты.
          // Порядок по умолчанию: «широта, долгота».
          // Чтобы не определять координаты центра карты вручную,
          // воспользуйтесь инструментом Определение координат.
          center: myCoordinates,
          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 13,
        });
        myMap.events.add("click", (ev) => {
          mapEvent = ev;
          form.classList.remove("hidden");
          inputDistance.focus();
        });
      }
    },
    function () {
      alert("Вы не предоставили свою геопозицию");
    }
  );
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    inputDistance.focus();
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
  inputType.addEventListener("change", () => {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  });
}
*/
