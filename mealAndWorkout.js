class Meal {
  constructor(name, calories) {
    this.name = name;
    this.cal = calories;
    this.id = Math.floor(Math.random() * 9 + 1);
  }
}

class Workout {
  constructor(name, calories) {
    this.name = name;
    this.cal = calories;
    this.id = Math.floor(Math.random() * 9 + 1);
  }
}

export { Meal, Workout };
