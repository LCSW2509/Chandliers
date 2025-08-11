document.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("chandler_tasks")) || [];
  console.log("Loaded tasks:", tasks);
  const todoColumn = document.getElementById("todo-tasks");
  const inProgressColumn = document.getElementById("inprogress-tasks");
  const doneColumn = document.getElementById("done-tasks");

  // Clear columns
  todoColumn.innerHTML = "";
  inProgressColumn.innerHTML = "";
  doneColumn.innerHTML = "";


  // Drag and drop handlers
  window.allowDrop = function (ev) {
    ev.preventDefault();
  };

  window.drag = function (ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  };

  window.drop = function (ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const target = ev.target.closest(".kanban-tasks");

    if (target && draggedElement) {
      target.appendChild(draggedElement);

      // Update task status based on new parent column
      const taskIndex = parseInt(draggedElement.id.split("-")[1], 10);
      let newStatus = "";

      if (target.id === "todo-tasks") {
        newStatus = "todo";
      } else if (target.id === "inprogress-tasks") {
        newStatus = "inprogress";
      } else if (target.id === "done-tasks") {
        newStatus = "done";
      }

      // Update tasks in localStorage
      tasks[taskIndex].status = newStatus;
      localStorage.setItem("chandler_tasks", JSON.stringify(tasks));
    }
  };
  // Create and append task elements based on status
  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.id = `task-${index}`;
    taskDiv.draggable = true;
    taskDiv.ondragstart = drag;
    taskDiv.innerHTML = `<p>${task.title}</p>`;

    // Append to correct column
    if (task.status === "todo") {
      todoColumn.appendChild(taskDiv);
    } else if (task.status === "inprogress") {
      inProgressColumn.appendChild(taskDiv);
    } else if (task.status === "done") {
      doneColumn.appendChild(taskDiv);
    } else {
      // If status missing or unknown, default to todo
      todoColumn.appendChild(taskDiv);
    }
  });
});
