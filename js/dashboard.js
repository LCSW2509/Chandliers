// Real-time Clock
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById("clock");
  clockEl.textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();

// Motivational Quote
  function getQuote() {
  fetch("https://api.quotable.io/random")
    .then(res => res.json())
    .then(data => {
      document.getElementById("quote").textContent = `"${data.content}"`;
      document.getElementById("author").textContent = `— ${data.author}`;
    })
    .catch(() => {
      document.getElementById("quote").textContent = "Keep pushing forward — you're doing great!";
      document.getElementById("author").textContent = "";
    });
}

  // Load a quote when the page loads
  window.addEventListener("DOMContentLoaded", getQuote);


//Weather (OpenWeatherMap)
const weatherKey = "eb868f447412db6a9d012d278f6ebd69";
const city = "Toronto";

//For test: https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=eb868f447412db6a9d012d278f6ebd69&units=metric

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
  .then(res => res.json())
  .then(data => {
    const weather = `${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
    document.getElementById("weather").textContent = weather;
  })
  .catch(() => {
    document.getElementById("weather").textContent = "Unable to fetch weather data.";
  });

// Task Summary from localStorage (demo)
function loadTaskStats() {
  const tasks = JSON.parse(localStorage.getItem("chandler_tasks")) || [];
  const today = new Date().toISOString().slice(0, 10);
  let dueToday = 0, overdue = 0, completed = 0;

  tasks.forEach(task => {
    if (task.status === "done") completed++;
    if (task.dueDate === today && task.status !== "done") dueToday++;
    if (task.dueDate < today && task.status !== "done") overdue++;
  });

  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("dueToday").textContent = dueToday;
  document.getElementById("overdue").textContent = overdue;
  document.getElementById("completed").textContent = completed;
}

loadTaskStats();
