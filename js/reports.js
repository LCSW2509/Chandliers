document.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem('chandler_tasks')) || [];

  // 1. Count task status
  const statusCounts = {
    todo: 0,
    done: 0,
    inprogress: 0
  };

  // 2. Count by department
  const departmentCounts = {
    "Raw Materials": 0,
    "Assembly": 0,
    "Packaging": 0,
    "Quality Check": 0
  };

  tasks.forEach(task => {
    // Default status fallback
    const status = task.status || "todo";
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    if (departmentCounts.hasOwnProperty(task.category)) {
      departmentCounts[task.category]++;
    }
  });

  // === Task Completion Pie Chart ===
const ctx1 = document.getElementById('taskChart').getContext('2d');
const statusLabels = ['To Do', 'In Progress', 'Completed'];
const statusColors = ['#f44336', '#2196f3', '#4caf50'];

const statusData = [
  statusCounts.todo || 0,
  statusCounts.inprogress || 0,
  statusCounts.done || 0
];

new Chart(ctx1, {
  type: 'pie',
  data: {
    labels: statusLabels,
    datasets: [{
      data: statusData,
      backgroundColor: statusColors,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false // Hide default legend
      },
      title: {
        display: true,
        text: 'Task Completion Status'
      }
    }
  }
});

// === Custom Legend Rendering ===
const legendContainer = document.getElementById('taskLegend');
statusLabels.forEach((label, i) => {
  const color = statusColors[i];
  const count = statusData[i];
  const legendItem = document.createElement('span');
  legendItem.innerHTML = `<i style="background-color:${color}"></i> ${label} (${count})`;
  legendContainer.appendChild(legendItem);
});


  // === Department Task Distribution Chart ===
  const ctx2 = document.getElementById('departmentChart').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(departmentCounts),
      datasets: [{
        label: 'Tasks per Department',
        data: Object.values(departmentCounts),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Department-wise Task Distribution'
        }
      }
    }
  });
});
