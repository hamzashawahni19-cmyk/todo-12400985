// File: js/app.js
// Student: Hamza Shawahni (12400985)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
 API ENDPOINTS (already implemented on the server):
 Base URL: http://portal.almasar101.com/assignment/api

 1) Add task (POST)
    add.php?stdid=STUDENT_ID&key=API_KEY
    Body (JSON): { "title": "Task title" }
    Returns JSON with the added task.

 2) Get tasks (GET)
    get.php?stdid=STUDENT_ID&key=API_KEY
    - If "id" is omitted: returns all tasks for this student.
    - If "id=NUMBER" is provided: returns one task.

 3) Delete task (GET or DELETE)
    delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
    Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12400985";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 * GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 * - Parse the JSON response.
 * - Loop over the "tasks" array (if it exists).
 * - For each task, create an <li> with class "task-item"
 *   and append it to #task-list.
 */
document.addEventListener("DOMContentLoaded", function () {
  setStatus("Fetching tasks..");

  const url = API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      return res.json();
    })
    .then((data) => {
      if (!list) return;
      list.innerHTML = "";
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task) => {
          renderTask(task);
        });
      }
      setStatus("");
    })
    .catch((err) => {
      setStatus(err.message, true);
    });
});

/**
 * TODO 2:
 * When the form is submitted:
 * - prevent the default behaviour.
 * - read the value from #task-input.
 * - send a POST request using fetch to:
 *   API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *   with headers "Content-Type: application/json"
 *   and body JSON: { title: "..." }
 * - on success, add the new task to the DOM and clear the input.
 */
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    setStatus("Adding task...");

    const url =
      API_BASE +
      "/add.php?stdid=" +
      encodeURIComponent(STUDENT_ID) +
      "&key=" +
      encodeURIComponent(API_KEY);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add task");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          renderTask(data.task);
          input.value = "";
          setStatus("Task added successfully!!");
        } else {
          setStatus("Could not add task", true);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(err.message, true);
      });
  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 * - send a request to:
 *   API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 * - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 * - Creates <li>, <span> for title, and a "Delete" <button>.
 * - Attaches a click listener to the delete button.
 * - Appends the <li> to #task-list.
 */

// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  // Expected task object fields: id, title, stdid, is_done, created_at (depends on API)

  const li = document.createElement("li");
  li.className = "task-item";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", function () {
    if (!confirm("Delete this task?")) return;

    setStatus("Deleting task...");

    const url =
      API_BASE +
      "/delete.php?stdid=" +
      encodeURIComponent(STUDENT_ID) +
      "&key=" +
      encodeURIComponent(API_KEY) +
      "&id=" +
      encodeURIComponent(task.id);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          li.remove();
          setStatus("Task deleted");
        } else {
          setStatus("Delete failed", true);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(err.message, true);
      });
  });

  actionsDiv.appendChild(deleteBtn);
  li.appendChild(titleSpan);
  li.appendChild(actionsDiv);
  list.appendChild(li);
}
