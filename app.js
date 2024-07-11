const addMeal = document.querySelector(".toggle-meal");
const mealDiv = document.querySelector(".add-meal");
const hideBtn = document.querySelector(".toggle-workout");
const addWorkoutDiv = document.querySelector(".add-workout");
const dailyLimitBtn = document.querySelector(".set"); //Set Daily Limit Btn

function disableBackGround() {
  const disableDiv = document.querySelector(".disable");
  if (disableDiv) {
    disableDiv.remove();
  } else {
    const disableDiv = document.createElement("div");
    disableDiv.classList.add("disable");
    document.body.insertAdjacentElement("afterbegin", disableDiv);
  }
}

document
  .querySelector(".header-container")
  .style.setProperty("--progress", 0 + "%");

hideBtn.addEventListener("click", () => {
  addWorkoutDiv.classList.toggle("hidden");
  if (hideBtn.innerHTML === "<span>+</span>") {
    hideBtn.innerHTML = " <span>-</span>";
  } else {
    hideBtn.innerHTML = "<span>+</span>";
  }
});
addMeal.addEventListener("click", () => {
  mealDiv.classList.toggle("hidden");
  if (addMeal.innerHTML === "<span>+</span>") {
    addMeal.innerHTML = " <span>-</span>";
  } else {
    addMeal.innerHTML = "<span>+</span>";
  }
});

//------------------------------------project Starts------------------------
// ------------------------------- CalorieTracker-class---------------
class CalorieTracker {
  constructor() {
    this._storage = new Storage();
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalorie();
    this._meals = this._storage._getItemLocalStorage("meals");
    this._workouts = this._storage._getItemLocalStorage("workouts");

    this._displayTotalCalorie();
    this._displayCalorieLimit(); //checked
    this._displayBurned(); //checked
    this._displayConsumed(); //checked
    this._displayProgress();
    this._addListener();
    this._render();
  }
  //------------------------public Methods--------------------------------
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.cal;
    this._displayConsumed();
    Storage.updateTotalCalorie(this._totalCalories);
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.cal;
    Storage.updateTotalCalorie(this._totalCalories);
    this._displayBurned();
    this._render();
  }

  //--------------private method------------------------------------------
  _removeItem(type, id) {
    if (type === "meal") {
      const storageList = this._storage._getItemLocalStorage("meals");
      const item = storageList.find((item) => item.id === id);
      console.log("the id is" + id);
      const itemIndex = storageList.indexOf(item);
      this._totalCalories -= item.cal;
      Storage.updateTotalCalorie(this._totalCalories);
      this._meals.splice(itemIndex, 1);

      this._displayConsumed();
    } else if (type === "workout") {
      const storageList = this._storage._getItemLocalStorage("workouts");
      const item = storageList.find((item) => item.id === id);
      const itemIndex = storageList.indexOf(item);
      this._totalCalories += item.cal;
      this._workouts.splice(itemIndex, 1);
      this._displayBurned();
    }
    this._render();
  }

  _displayTotalCalorie() {
    const totalCalories = document.querySelector(".gain h2");
    totalCalories.textContent = this._totalCalories;
  }

  _displayCalorieLimit() {
    const calorieLimit = document.querySelector(".cal-limit h2");
    calorieLimit.textContent = this._calorieLimit;
  }

  _displayConsumed() {
    var totalConsumed = 0;
    this._meals.forEach((meal) => {
      totalConsumed += meal.cal;
    });
    const consumed = document.querySelector(".consumed h2");

    consumed.textContent = totalConsumed;
  }

  _displayBurned() {
    var totalBurned = 0;
    const burnedText = document.querySelector(".burned h2");
    this._workouts.forEach((workout) => {
      totalBurned += workout.cal;
    });
    burnedText.textContent = totalBurned;
  }

  _displayCaloriesRemaining() {
    this._calorieRemaining = this._calorieLimit - this._totalCalories;

    const remainingText = document.querySelector(".remaining h2");
    remainingText.textContent = this._calorieRemaining;
  }

  _displayProgress() {
    const bar = document.querySelector(".bar");
    const remaining = document.querySelector(".remaining");

    const progressPercent = (this._totalCalories / this._calorieLimit) * 100;
    bar.style.width = `${progressPercent}%`;
    const precent = document.querySelector(".percent");
    precent.innerHTML = `<strong>${progressPercent.toFixed(0)}%</strong>`;

    if (progressPercent >= 100) {
      bar.style.backgroundColor = "red";
      precent.innerHTML = `<strong>${progressPercent.toFixed(0)}%</strong>`;
      remaining.style.backgroundColor = "red";
    } else {
      if (progressPercent < 0) {
        bar.style.width = "0px";
      }
      bar.style.backgroundColor = "rgb(84, 118, 94, 0.95)";
      remaining.style.backgroundColor = "rgb(219, 219, 219, 0.3)";
    }
  }

  _reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._calorieRemaining = 0;
    this._render();
  }

  _setNewDailyLimit(e) {
    e.preventDefault();
    const setInput = document.querySelector("input[name='limit-input']").value;
    const oldLimit = document.querySelector(".cal-limit h2");
    if (!setInput) {
      alert("Field Cannot be Empty");
    } else {
      this._calorieLimit = setInput;
      oldLimit.textContent = setInput;

      const popUp = document.querySelector("#pop-up");
      dailyLimitBtn.textContent = "Set Daily Limit";
      dailyLimitBtn.style.backgroundColor = "#2E2E2E";
      disableBackGround();
      Storage.setCalorieLimit(setInput);
      popUp.remove();
      this._render();
    }
  }

  _showDailyBoxPopUp() {
    const popUp = document.querySelector("#pop-up");
    if (popUp) {
      dailyLimitBtn.textContent = "Set Daily Limit";
      dailyLimitBtn.style.backgroundColor = "#2E2E2E";
      popUp.remove();
    } else {
      const popUpDiv = document.createElement("div");
      popUpDiv.id = "pop-up";
      popUpDiv.innerHTML = `<h4>Set Daily Limit</h4>
            <form class='submit'>
            <input type="text" name="limit-input" placeholder="Enter Calories">
            <button class="set-btn"> Set</button>
            </form>`;
      document.body.insertAdjacentElement("afterbegin", popUpDiv);
      dailyLimitBtn.style.backgroundColor = "red";
      dailyLimitBtn.textContent = "Close Pop Up";

      const submitForm = document.querySelector(".submit");
      submitForm.addEventListener("submit", this._setNewDailyLimit.bind(this));
    }
  }

  _addListener() {
    dailyLimitBtn.addEventListener("click", this._showDailyBoxPopUp.bind(this));
    dailyLimitBtn.addEventListener("click", disableBackGround);
  }

  _render() {
    this._displayTotalCalorie();
    this._displayCaloriesRemaining();
    this._displayCalorieLimit();
    this._displayProgress();
  }
}
// ------------------------------- Meal and Workout --------------------
class Meal {
  constructor(name, calories) {
    this.name = name;
    this.cal = calories;
    this.id = `M${Math.random().toString(36).slice(2)}`;
  }
}

class Workout {
  constructor(name, calories) {
    this.name = name;
    this.cal = calories;
    this.id = `W${Math.random().toString(36).slice(2)}`;
  }
}
//-------------------------------- Storage Class -------------------------

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }
  static setCalorieLimit(limit) {
    localStorage.setItem("calorieLimit", limit);
  }

  static getTotalCalorie(initialValue = 0) {
    let totalCalorie;
    if (localStorage.getItem("totalCalorie") === null) {
      totalCalorie = initialValue;
    } else {
      totalCalorie = +localStorage.getItem("totalCalorie");
    }
    return totalCalorie;
  }

  static updateTotalCalorie(calorie) {
    localStorage.setItem("totalCalorie", calorie);
  }

  _addItemLocalStorage(name, item) {
    let localStorageList = localStorage.getItem(name);
    if (localStorageList === null) {
      localStorageList = [];
      localStorageList.push(item);
      const itemToAdd = JSON.stringify(localStorageList);
      localStorage.setItem(name, itemToAdd);
    } else {
      localStorageList = JSON.parse(localStorage.getItem(name));
      localStorageList.push(item);
      localStorage.removeItem(name);
      localStorage.setItem(name, JSON.stringify(localStorageList));
    }
  }

  _getItemLocalStorage(name) {
    let itemList;
    if (localStorage.getItem(name) === null) {
      itemList = [];
    } else {
      itemList = JSON.parse(localStorage.getItem(name));
    }
    return itemList;
  }

  _removeLocalStorage(name, id) {
    const storageData = JSON.parse(localStorage.getItem(name));
    const itemToRemove = storageData.find((item) => item.id === id);
    const indexOfItem = storageData.indexOf(itemToRemove);
    storageData.splice(indexOfItem, 1);
    localStorage.removeItem(name);
    localStorage.setItem(name, JSON.stringify(storageData));
  }
}
//---------------------------------App Class ------------------------------
class App {
  constructor() {
    this._init = new CalorieTracker();
    this._storage = new Storage();
    this._addListeners();
    this._displayLocalStorage();
  }
  _displayLocalStorage() {
    const getItemLocalStorageMeals =
      this._storage._getItemLocalStorage("meals");
    const getItemLocalStorageWorkout =
      this._storage._getItemLocalStorage("workouts");

    if (getItemLocalStorageMeals !== null)
      getItemLocalStorageMeals.forEach((meal) => {
        this._displayItem("meal", meal.name, meal.cal, meal.id);
      });
    if (getItemLocalStorageWorkout !== null)
      getItemLocalStorageWorkout.forEach((workout) => {
        this._displayItem("workout", workout.name, workout.cal, workout.id);
      });
    this._init._render();
  }

  _newItem(e) {
    e.preventDefault();
    const target = e.target;
    //-------------------------Meal Validation an adding --------------------
    if (target.classList.contains("meal-form")) {
      let addedMealName = document.querySelector("input[name='meal-enter']");
      let addedCalorieInput = document.querySelector(
        "input[name='calorie-enter']"
      );
      if (
        addedCalorieInput.value.trim() === "" ||
        addedMealName.value.trim() === ""
      ) {
        alert("fillout all the fields");
      } else {
        const meal = new Meal(
          addedMealName.value,
          parseInt(addedCalorieInput.value)
        );
        this._init.addMeal(meal);
        mealDiv.classList.add("hidden");
        this._storage._addItemLocalStorage("meals", meal);
        this._displayItem("meal", meal.name, meal.cal, meal.id);
        addedCalorieInput.value = "";
        addedMealName.value = "";
        if (addMeal.innerHTML === "<span>+</span>") {
          addMeal.innerHTML = " <span>-</span>";
        } else {
          addMeal.innerHTML = "<span>+</span>";
        }
      }
      // --------------------------- Workout Validation and Adding ---------------
    } else if (target.classList.contains("workout-form")) {
      let addedWorkoutName = document.querySelector(
        "input[name='workout-enter']"
      );
      let workoutCalorie = document.querySelector(
        "input[name='workout-calorie-enter']"
      );
      if (
        addedWorkoutName.value.trim() === "" ||
        workoutCalorie.value.trim() === ""
      ) {
        alert("New WorkOut Form: Fillout all the Fields");
      } else {
        const workout = new Workout(
          addedWorkoutName.value,
          parseInt(workoutCalorie.value)
        );
        this._init.addWorkout(workout);
        this._displayItem("workout", workout.name, workout.cal, workout.id);
        this._storage._addItemLocalStorage("workouts", workout);
        workoutCalorie.value = "";
        addedWorkoutName.value = "";
        if (hideBtn.innerHTML === "<span>+</span>") {
          hideBtn.innerHTML = " <span>-</span>";
        } else {
          hideBtn.innerHTML = "<span>+</span>";
        }
        document.querySelector(".add-workout").classList.toggle("hidden");
      }
    }
  }
  _displayItem(type, itemName, itemCalorie, Id) {
    if (type === "meal") {
      const mealDom = document.querySelector(".dom-meal");
      const div = document.createElement("div");
      const text = document.createElement("h2");
      const calorieText = document.createElement("h2");
      const btn = document.createElement("button");

      text.textContent = itemName;
      calorieText.textContent = itemCalorie;
      calorieText.classList.add("number");
      btn.textContent = "X";
      btn.classList.add("delete-btn");

      div.className = "info";
      div.setAttribute("data-id", Id);

      div.appendChild(text);
      div.appendChild(calorieText);
      div.appendChild(btn);

      mealDom.appendChild(div);
    } else if (type === "workout") {
      const workoutDom = document.querySelector(".dom-workout");
      const div = document.createElement("div");
      const workoutText = document.createElement("h2");
      const workoutCalorieText = document.createElement("h2");
      const btn = document.createElement("button");

      div.className = "info";
      div.setAttribute("data-id", Id);
      btn.classList.add("delete-btn");
      workoutCalorieText.classList.add("number");

      workoutText.textContent = itemName;
      workoutCalorieText.textContent = itemCalorie;

      btn.textContent = "X";
      div.appendChild(workoutText);
      div.appendChild(workoutCalorieText);
      div.appendChild(btn);
      workoutDom.appendChild(div);
    }
  }

  _remove(e) {
    const target = e.target;
    if (target.classList.contains("delete-btn")) {
      const parentElement = target.parentElement;
      console.log(parentElement);
      const id = parentElement.getAttribute("data-id");
      console.log("in remove function the id is" + id);

      if (parentElement.parentElement.classList.contains("dom-meal")) {
        this._init._removeItem("meal", id);
        this._storage._removeLocalStorage("meals", id);
      } else if (
        target.parentElement.parentElement.classList.contains("dom-workout")
      ) {
        this._init._removeItem("workout", id);
        this._storage._removeLocalStorage("workouts", id);
      }

      parentElement.remove();
    }
    this._init._render();
  }

  _filterItem() {
    const mealList = document.querySelectorAll(".dom-meal .info");
    const input = document
      .querySelector("input[id='meal']")
      .value.toLowerCase();

    mealList.forEach((item) => {
      if (item.firstElementChild.textContent.toLowerCase().includes(input)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  _filterWorkout(e) {
    const input = e.target.value;

    const workoutList = document.querySelectorAll(".dom-workout .info");
    workoutList.forEach((item) => {
      if (
        item.firstElementChild.textContent.toLocaleLowerCase().includes(input)
      ) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    const allItems = document.querySelectorAll(".info");
    allItems.forEach((item) => {
      item.remove();
    });
    localStorage.clear();
    this._init._reset();
  }
  _addListeners() {
    //-----------------------meal event listener------------------------------------
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", this._newItem.bind(this));
    });
    document
      .querySelector("#container")
      .addEventListener("click", this._remove.bind(this));

    document
      .querySelector("input[id='meal']")
      .addEventListener("input", this._filterItem.bind(this));
    document
      .querySelector("input[id='workout']")
      .addEventListener("input", this._filterWorkout.bind(this));
    document
      .querySelector("#reset")
      .addEventListener("click", this._reset.bind(this));
  }
}

const app = new App();
