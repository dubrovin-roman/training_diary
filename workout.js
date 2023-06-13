"use strict";

class Workout {
  id = (Date.now() + "").slice(-10);
  date = new Date();

  constructor(coord, distance, duration) {
    this.coord = coord;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coord, distance, duration, cadence) {
    super(coord, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coord, distance, duration, elevation) {
    super(coord, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

export { Running, Cycling };
