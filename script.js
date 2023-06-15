"use strict";

import { Running, Cycling } from "./workout.js";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const btnReset = document.querySelector(".reset-btn");

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
    containerWorkouts.addEventListener(
      "click",
      this._movingToSelectedWorkout.bind(this)
    );
    btnReset.addEventListener("click", this._reset);
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
      this._getWorkoutsFromLocalStorage();
    }
  }

  _showForm(ev) {
    this._mapEvent = ev;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hiddenForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
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
    //сохранение тренировок в LocalStorage
    this._saveWorkoutToLocalStorage();
    //отрисовка тренировки на карте
    this._renderingWorkoutOnMap(workout);
    //отрисовка тренеровки на sidebar
    this._renderingWorkoutOnSidebar(workout);
    //скрываем форму ввода
    this._hiddenForm();
  }

  _renderingWorkoutOnMap(workout) {
    const tempBalloon = new ymaps.Placemark(
      workout.coord,
      {
        iconContent: `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
          workout.description
        }`,
        balloonContentHeader: `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
          workout.description
        }`,
        balloonContentBody: workout.contentBody,
      },
      {
        preset: "islands#darkGreenStretchyIcon",
      }
    );
    this._myMap.geoObjects.add(tempBalloon);
  }

  _renderingWorkoutOnSidebar(workout) {
    const html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">км</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">мин</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${
        workout.type === "running"
          ? workout.pace.toFixed(1)
          : workout.speed.toFixed(1)
      }</span>
      <span class="workout__unit">${
        workout.type === "running" ? "мин/км" : "км/час"
      }</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === "running" ? "🦶🏼" : "⛰"
      }</span>
      <span class="workout__value">${
        workout.type === "running" ? workout.cadence : workout.elevation
      }</span>
      <span class="workout__unit">${
        workout.type === "running" ? "шаг" : "м"
      }</span>
    </div>
  </li>`;
    form.insertAdjacentHTML("afterend", html);
  }

  _movingToSelectedWorkout(ev) {
    const workoutElement = ev.target.closest(".workout");
    if (!workoutElement) return;
    const workout = this._workouts.find(
      (value) => value.id == workoutElement.dataset.id
    );

    this._myMap.setCenter(workout.coord, 13, { duration: 800 });
  }

  _saveWorkoutToLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this._workouts));
  }

  _getWorkoutsFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;
    this._workouts = data;
    this._workouts.forEach((workout) => {
      this._renderingWorkoutOnMap(workout);
      this._renderingWorkoutOnSidebar(workout);
    });
  }

  _changingFormWhenSwitchingTypeOfTraining() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _reset() {
    localStorage.removeItem("workouts");
    location.reload();
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
