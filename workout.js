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

class Workout {
  id = (Date.now() + "").slice(-10);
  date = new Date();

  constructor(coord, distance, duration) {
    this.coord = coord;
    this.distance = distance;
    this.duration = duration;
  }

  _createDescription() {
    this.description = `${this.type[0].toLocaleUpperCase()}${this.type.slice(1)} ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coord, distance, duration, cadence) {
    super(coord, distance, duration);
    this.cadence = cadence;
    this._calcPace();
    this._createDescription();
    this._createBalloonContentBody();
  }

  _calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }

  _createBalloonContentBody() {
    this.contentBody = `🏃‍♂️ ${this.distance} км 
    ⏱ ${this.duration} мин 
    ⚡️ ${this.pace} мин/км 
    🦶🏼 ${this.cadence} шаг/мин`;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coord, distance, duration, elevation) {
    super(coord, distance, duration);
    this.elevation = elevation;
    this._calcSpeed();
    this._createDescription();
    this._createBalloonContentBody();
  }

  _calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }

  _createBalloonContentBody() {
    this.contentBody = `🚴‍♀️ ${this.distance} км 
    ⏱ ${this.duration} мин 
    ⚡️ ${this.speed} км/час 
    ⛰ ${this.elevation} м`;
  }
}

export { Running, Cycling };
