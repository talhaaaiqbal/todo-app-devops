/* ==========================================================
   Day Plan — pure logic
   These functions only take data in and give data back.
   They do not touch the page, so Node.js can test them
   inside the CI workflow.
   ========================================================== */

// Add a task and return the new list. Empty text is ignored.
function addTaskToList(list, text, id) {
  var cleaned = text.trim();
  if (cleaned === "") {
    return list;
  }
  return list.concat([{ id: id, text: cleaned, done: false }]);
}

// Flip the done value of one task.
function toggleTaskInList(list, id) {
  return list.map(function (task) {
    if (task.id === id) {
      return { id: task.id, text: task.text, done: !task.done };
    }
    return task;
  });
}

// Remove one task by its id.
function removeTaskFromList(list, id) {
  return list.filter(function (task) {
    return task.id !== id;
  });
}

// Remove every completed task.
function removeCompleted(list) {
  return list.filter(function (task) {
    return task.done === false;
  });
}

// Return only the tasks that match the chosen filter.
function filterTasks(list, filter) {
  if (filter === "active") {
    return list.filter(function (task) { return task.done === false; });
  }
  if (filter === "done") {
    return list.filter(function (task) { return task.done === true; });
  }
  return list;
}

// How many tasks are finished.
function countDone(list) {
  return list.filter(function (task) { return task.done; }).length;
}

// Make these available to Node.js when the tests import this file.
// The browser ignores this block because "module" does not exist there.
if (typeof module !== "undefined") {
  module.exports = {
    addTaskToList: addTaskToList,
    toggleTaskInList: toggleTaskInList,
    removeTaskFromList: removeTaskFromList,
    removeCompleted: removeCompleted,
    filterTasks: filterTasks,
    countDone: countDone
  };
}
