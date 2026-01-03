/* ===============================
   SELECT DOM ELEMENTS
================================ */
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed");


/* ===============================
   APPLICATION STATE
================================ */
// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* ===============================
   RENDER TASKS TO UI
================================ */
function renderTasks(filter = "all") {
    // Clear existing list to avoid duplicates
    taskList.innerHTML = "";

    // Decide which tasks to show
    let filteredTasks = tasks;

    if (filter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Create list items dynamically
    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");

        // Apply completed class if task is done
        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;

        /* Toggle completed state */
        li.querySelector(".task-text").addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveAndRender();
        });

        /* Delete task */
        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveAndRender();
        });

        taskList.appendChild(li);
    });
}


/* ===============================
   SAVE & RE-RENDER
================================ */
function saveAndRender(filter = getActiveFilter()) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(filter);
}


/* ===============================
   ADD NEW TASK
================================ */
taskForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    tasks.push({
        text: taskText,
        completed: false
    });

    taskInput.value = "";
    saveAndRender();
});


/* ===============================
   FILTER TASKS
================================ */
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        renderTasks(button.dataset.filter);
    });
});


/* ===============================
   CLEAR COMPLETED TASKS
================================ */
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
});


/* ===============================
   HELPER FUNCTION
================================ */
function getActiveFilter() {
    return document.querySelector(".filter-btn.active").dataset.filter;
}


/* ===============================
   INITIAL RENDER
================================ */
renderTasks();



/* ===============================
   DARK MODE TOGGLE
================================ */
const themeToggleBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggleBtn.textContent = "☀️ Light Mode";
}

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggleBtn.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggleBtn.textContent = "🌙 Dark Mode";
    }
});
