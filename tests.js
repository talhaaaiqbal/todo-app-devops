/* ==========================================================
   Day Plan — tests
   Run with:  node tests.js
   GitHub Actions runs this on every push. If any check fails,
   the script exits with an error and the CI run turns red.
   ========================================================== */

var logic = require("./logic.js");

var passed = 0;
var failed = 0;

function check(name, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log("PASS - " + name);
    passed = passed + 1;
  } else {
    console.log("FAIL - " + name);
    console.log("   expected: " + JSON.stringify(expected));
    console.log("   received: " + JSON.stringify(actual));
    failed = failed + 1;
  }
}

// ----- Sample data used by several tests -----
var sample = [
  { id: 1, text: "Read chapter 2", done: false },
  { id: 2, text: "Submit assignment", done: true }
];

// ----- Test 1: adding a task -----
check(
  "adds a new task to the list",
  logic.addTaskToList([], "Buy milk", 99),
  [{ id: 99, text: "Buy milk", done: false }]
);

// ----- Test 2: empty text is rejected -----
check(
  "ignores empty task text",
  logic.addTaskToList([], "   ", 99),
  []
);

// ----- Test 3: marking a task done -----
check(
  "marks a task as done",
  logic.toggleTaskInList(sample, 1)[0].done,
  true
);

// ----- Test 4: deleting a task -----
check(
  "deletes a task by id",
  logic.removeTaskFromList(sample, 1).length,
  1
);

// ----- Test 5: clearing completed tasks -----
check(
  "removes completed tasks",
  logic.removeCompleted(sample).length,
  1
);

// ----- Test 6: filtering -----
check(
  "filter 'active' returns unfinished tasks only",
  logic.filterTasks(sample, "active").length,
  1
);

// ----- Test 7: counting -----
check(
  "counts completed tasks",
  logic.countDone(sample),
  1
);

// ----- Summary -----
console.log("");
console.log(passed + " passed, " + failed + " failed");

if (failed > 0) {
  process.exit(1);
}
