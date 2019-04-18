function decimal_to_dms (angle) {
  let sign = 1.0;
  if (angle < 0) {
    sign = -1.0;
  }

  angle = Math.abs(angle);

  let degrees = Math.floor(angle);

  let minutes_float = (angle - degrees) * 60;
  let minutes = Math.floor(minutes_float);

  let seconds = (minutes_float - minutes) * 60;

  return {
    degrees: degrees*sign,
    minutes: minutes*sign,
    seconds: seconds*sign,
  }
}


class AnglePosition {
  degrees = 0;
  minutes = 0;
  seconds = 0;

  constructor ({degrees = 0, minutes = 0, seconds = 0} = {}) {
    this.degrees = degrees;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  toJSON () {
    return {
      degrees: this.degrees,
      minutes: this.minutes,
      seconds: this.seconds
    };
  }

  to_decimal () {
    return this.degrees + this.minutes / 60.0 + this.seconds / 3600.0;
  }

  static from_decimal (angle) {
    return new AnglePosition(decimal_to_dms(angle));
  }
}


class AstronomicalPosition {
  hours   = 0;
  minutes = 0;
  seconds = 0;
  longitude = undefined;

  constructor ({hours = 0, minutes = 0, seconds = 0, longitude = undefined} = {}) {
    this.hours   = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.longitude = longitude;
  }

  toJSON () {
    return {
      hours:   this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      longitude: this.longitude
    };
  }

  to_decimal () {
    return this.hours + this.minutes / 60.0 + this.seconds / 3600.0;
  }

  // Here position represents a Right Ascencion
  static from_decimal (position) {
    let parsed = decimal_to_dms(position);
    parsed.hours = parsed.degrees;
    return new AstronomicalPosition(parsed);
  }
}
export { AnglePosition, AstronomicalPosition, decimal_to_dms };
