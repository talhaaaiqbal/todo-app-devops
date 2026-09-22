/* ==========================================================
   Day Plan — page behaviour
   This file connects the buttons and inputs on the page to
   the pure functions in logic.js, and saves the tasks in the
   browser's localStorage so they survive a refresh.
   ========================================================== */

// ----- Grab the elements we need from the page -----
var taskInput    = document.getElementById("taskInput");
var addButton    = document.getElementById("addButton");
var taskList     = document.getElementById("taskList");
var errorMessage = document.getElementById("errorMessage");
var emptyState   = document.getElementById("emptyState");
var counter      = document.getElementById("counter");
var clearDone    = document.getElementById("clearDone");
var filters      = document.getElementById("filters");
var todayDate    = document.getElementById("todayDate");

// ----- Application state -----
var tasks = [];             // every task looks like { id, text, done }
var currentFilter = "all";  // "all" | "active" | "done"

var STORAGE_KEY = "dayplan.tasks";

// ==========================================================
// Saving and loading
// ==========================================================

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// ==========================================================
// Actions
// ==========================================================

function addTask() {
  var text = taskInput.value;

  if (text.trim() === "") {
    errorMessage.textContent = "Type something first.";
    return;
  }

  errorMessage.textContent = "";
  tasks = addTaskToList(tasks, text, Date.now());
  taskInput.value = "";
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = toggleTaskInList(tasks, id);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = removeTaskFromList(tasks, id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = removeCompleted(tasks);
  saveTasks();
  render();
}

// ==========================================================
// Drawing the list on screen
// ==========================================================

function render() {
  var visible = filterTasks(tasks, currentFilter);

  // Clear whatever is currently shown
  taskList.innerHTML = "";

  // Build one list item for every visible task
  visible.forEach(function (task) {
    var item = document.createElement("li");
    item.className = task.done ? "task is-done" : "task";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task__check";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    var label = document.createElement("span");
    label.className = "task__text";
    label.textContent = task.text;

    var removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "task__delete";
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(removeButton);
    taskList.appendChild(item);
  });

  // Show or hide the empty message
  if (visible.length === 0) {
    emptyState.classList.remove("is-hidden");
  } else {
    emptyState.classList.add("is-hidden");
  }

  // Update the counter in the footer
  counter.textContent = countDone(tasks) + " of " + tasks.length + " done";
}

// ==========================================================
// Events
// ==========================================================

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

clearDone.addEventListener("click", clearCompleted);

filters.addEventListener("click", function (event) {
  var button = event.target;
  if (!button.dataset.filter) {
    return;
  }

  currentFilter = button.dataset.filter;

  // Move the "is-active" class onto the clicked button
  filters.querySelectorAll(".filters__item").forEach(function (item) {
    item.classList.remove("is-active");
  });
  button.classList.add("is-active");

  render();
});

// ==========================================================
// Start up
// ==========================================================

function showTodayDate() {
  var options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  todayDate.textContent = new Date().toLocaleDateString("en-GB", options);
}

showTodayDate();
loadTasks();
render();
