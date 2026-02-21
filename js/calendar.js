let currentDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
});

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthTitle").innerText =
    currentDate.toLocaleString("default", { month: "long" }) + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split("T")[0];
  const data = getData();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day)
      .toISOString()
      .split("T")[0];

    const div = document.createElement("div");
    div.className = "calendar-day";
    div.innerText = day;

    if (dateStr > todayStr) {
      div.classList.add("gray");
    } else {
      const log = data.dailyLogs[dateStr];

      if (!log) {
        div.classList.add("red");
      } else {
        // Check completion based on stored data
        const full = log.habitsCompleted && log.habitsCompleted.length >= 5;
        const partial = log.habitsCompleted && log.habitsCompleted.length > 0;

        if (full) div.classList.add("green");
        else if (partial) div.classList.add("yellow");
        else div.classList.add("red");
      }
    }

    div.addEventListener("click", () => showDayDetails(dateStr));

    grid.appendChild(div);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function goHome() {
  window.location.href = "index.html";
}

function showDayDetails(dateStr) {
  const data = getData();
  const log = data.dailyLogs[dateStr];

  if (!log) {
    alert("No data for this day.");
    return;
  }

  const habitsText = log.habitsCompleted ? log.habitsCompleted.join(", ") : "None";
  const dontsText = log.dontsBroken ? log.dontsBroken.join(", ") : "None";

  alert(`Date: ${dateStr}
Habits: ${habitsText}
Don'ts Broken: ${dontsText}
Earned: ₹${log.earned || 0}
Penalty: ₹${log.penalty || 0}
Streak: ${log.streak || 0}`);
}
