document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");

  let tasks = JSON.parse(localStorage.getItem("chandler_tasks")) || [];

  // ===== Function to Render Tasks =====
  const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <small>
          Category: ${task.category} | 
          Priority: ${task.priority} | 
          Due: ${task.dueDate}
        </small>
        <div class="task-actions">
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  };

  // ===== Validation Function =====
  function validateTask(title, dueDate) {
    if (!title || title.trim() === "") {
      alert("Please enter a valid title.");
      return false;
    }

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      alert("Please enter a valid date.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // midnight
     parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      alert("Please enter today or a future date.");
      return false;
    }

    return true;
  }

  // ===== Handle Task Submission =====
  taskForm.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    // Run validation
    if (!validateTask(title, dueDate)) return;


    const status = "todo"; // default for new tasks

    const task = { title, description, category, priority, dueDate, status };
    // (id, title, description, priority, dueDate, status, -createdDate, *tags)
    tasks.push(task);

    localStorage.setItem("chandler_tasks", JSON.stringify(tasks));
    taskForm.reset();
    renderTasks();
  });

  // ===== Delete Task =====
  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    localStorage.setItem("chandler_tasks", JSON.stringify(tasks));
    renderTasks();
  };

  // ===== Edit Task =====
  window.editTask = function(index) {
    const task = tasks[index];
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("category").value = task.category;
    document.getElementById("priority").value = task.priority;
    document.getElementById("dueDate").value = task.dueDate;

    deleteTask(index); // Remove old task before adding edited one
  };

  // Initial Render
  renderTasks();
});
