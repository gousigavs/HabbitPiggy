document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderBreakdown();
  renderCharts();
});

function renderSummary() {
  const data = getData();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  let totalEarned = 0;
  let totalPenalty = 0;
  let daysTracked = 0;
  
  Object.keys(data.dailyLogs || {}).forEach(date => {
    const d = new Date(date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const log = data.dailyLogs[date];
      totalEarned += log.earned || 0;
      totalPenalty += log.penalty || 0;
      daysTracked++;
    }
  });
  
  // Calculate best and worst habits
  const habitStats = getHabitStats();
  
  let bestHabit = null;
  let worstHabit = null;
  
  if (habitStats.length > 0) {
    const sorted = [...habitStats].sort((a, b) => b.percentage - a.percentage);
    bestHabit = sorted[0];
    worstHabit = sorted[sorted.length - 1];
  }
  
  const container = document.getElementById("summary");
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
      <div class="mini-card">
        <strong>Days Tracked</strong>
        <p style="font-size: 24px; margin: 5px 0;">${daysTracked}</p>
      </div>
      <div class="mini-card">
        <strong>Current Balance</strong>
        <p style="font-size: 24px; margin: 5px 0; color: #22c55e;">₹${data.balance || 0}</p>
      </div>
      <div class="mini-card">
        <strong>Total Earned</strong>
        <p style="font-size: 24px; margin: 5px 0; color: #22c55e;">₹${totalEarned}</p>
      </div>
      <div class="mini-card">
        <strong>Total Penalties</strong>
        <p style="font-size: 24px; margin: 5px 0; color: #ef4444;">₹${totalPenalty}</p>
      </div>
      <div class="mini-card">
        <strong>Best Habit</strong>
        <p style="font-size: 18px; margin: 5px 0;">${bestHabit ? bestHabit.name : 'N/A'}</p>
        <p style="font-size: 14px; color: #22c55e;">${bestHabit ? bestHabit.percentage + '%' : ''}</p>
      </div>
      <div class="mini-card">
        <strong>Needs Improvement</strong>
        <p style="font-size: 18px; margin: 5px 0;">${worstHabit ? worstHabit.name : 'N/A'}</p>
        <p style="font-size: 14px; color: #ef4444;">${worstHabit ? worstHabit.percentage + '%' : ''}</p>
      </div>
    </div>
  `;
}

function getHabitStats() {
  const data = getData();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const stats = [];
  
  Object.keys(data.habitData || {}).forEach(habitId => {
    const habit = data.habitData[habitId];
    const completed = Object.keys(habit.history || {}).filter(date => {
      const d = new Date(date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    
    const percentage = ((completed / daysInMonth) * 100).toFixed(1);
    
    stats.push({
      name: habitId,
      completed,
      percentage: parseFloat(percentage)
    });
  });
  
  return stats;
}

function renderCharts() {
  const data = getData();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  // Daily activity chart
  const dailyActivity = {};
  Object.keys(data.habitData || {}).forEach(habitId => {
    const habit = data.habitData[habitId];
    Object.keys(habit.history || {}).forEach(date => {
      const d = new Date(date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const value = typeof habit.history[date] === "number" ? habit.history[date] : 1;
        dailyActivity[date] = (dailyActivity[date] || 0) + value;
      }
    });
  });
  
  const dates = Object.keys(dailyActivity).sort();
  const values = dates.map(d => dailyActivity[d]);
  
  const activityCtx = document.getElementById("activityChart");
  new Chart(activityCtx, {
    type: 'line',
    data: {
      labels: dates.map(d => new Date(d).getDate()),
      datasets: [{
        label: 'Daily Habit Intensity',
        data: values,
        borderColor: '#4c6ef5',
        backgroundColor: 'rgba(76, 110, 245, 0.1)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
  
  // Daily earnings chart
  const dailyEarnings = {};
  Object.keys(data.dailyLogs || {}).forEach(date => {
    const d = new Date(date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const log = data.dailyLogs[date];
      dailyEarnings[date] = (log.earned || 0) - (log.penalty || 0);
    }
  });
  
  const earningsDates = Object.keys(dailyEarnings).sort();
  const earningsValues = earningsDates.map(d => dailyEarnings[d]);
  
  const earningsCtx = document.getElementById("earningsChart");
  new Chart(earningsCtx, {
    type: 'line',
    data: {
      labels: earningsDates.map(d => new Date(d).getDate()),
      datasets: [{
        label: 'Net Earnings (₹)',
        data: earningsValues,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Habit completion chart
  const habitStats = getHabitStats();
  
  const completionCtx = document.getElementById("completionChart");
  new Chart(completionCtx, {
    type: 'bar',
    data: {
      labels: habitStats.map(h => h.name),
      datasets: [{
        label: 'Completion %',
        data: habitStats.map(h => h.percentage),
        backgroundColor: '#63e6be'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
  
  // Money earned per habit chart
  const habitEarnings = calculateHabitEarnings();
  
  const habitEarningsCtx = document.getElementById("habitEarningsChart");
  new Chart(habitEarningsCtx, {
    type: 'bar',
    data: {
      labels: habitEarnings.map(h => h.name),
      datasets: [{
        label: 'Total Earned (₹)',
        data: habitEarnings.map(h => h.earned),
        backgroundColor: '#fbbf24'
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

function calculateHabitEarnings() {
  const data = getData();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  // Build reward map from CONFIG
  const habitRewards = {};
  
  // Load custom habits if they exist
  const saved = localStorage.getItem("customHabits");
  let allHabits = [];
  
  if (saved) {
    const habits = JSON.parse(saved);
    allHabits = [...(habits.daily || []), ...(habits.weekly || []), ...(habits.biweekly || [])];
  } else {
    // Use default from CONFIG if available
    if (typeof CONFIG !== 'undefined') {
      allHabits = [...CONFIG.dailyHabits, ...CONFIG.weeklyHabits, ...CONFIG.biweeklyHabits];
    }
  }
  
  allHabits.forEach(h => {
    habitRewards[h.id] = h.reward;
  });
  
  const earnings = {};
  
  Object.keys(data.habitData || {}).forEach(habitId => {
    const habit = data.habitData[habitId];
    let totalEarned = 0;
    
    Object.keys(habit.history || {}).forEach(date => {
      const d = new Date(date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const value = habit.history[date];
        const reward = habitRewards[habitId] || 5; // fallback to 5
        
        if (typeof value === "number") {
          totalEarned += value * reward;
        } else if (value === true) {
          totalEarned += reward;
        }
      }
    });
    
    if (totalEarned > 0) {
      earnings[habitId] = totalEarned;
    }
  });
  
  return Object.keys(earnings).map(id => ({
    name: id,
    earned: earnings[id]
  })).sort((a, b) => b.earned - a.earned);
}

function renderBreakdown() {
  const data = getData();
  const container = document.getElementById("breakdown");
  
  if (!data.habitData || Object.keys(data.habitData).length === 0) {
    container.innerHTML = "<p>No habit data yet.</p>";
    return;
  }
  
  let html = "";
  Object.keys(data.habitData).forEach(habitId => {
    const habit = data.habitData[habitId];
    const completions = Object.keys(habit.history || {}).length;
    
    html += `
      <div class="mini-card">
        <strong>${habitId}</strong>
        <p>Streak: 🔥 ${habit.streak || 0} days</p>
        <p>Total completions: ${completions}</p>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function generateMonthlyData() {
  const data = getData();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  const rows = [];
  
  Object.keys(data.habitData || {}).forEach(habitId => {
    const habit = data.habitData[habitId];
    
    Object.keys(habit.history || {}).forEach(date => {
      const d = new Date(date);
      
      if (d.getMonth() === month && d.getFullYear() === year) {
        rows.push({
          Habit: habitId,
          Date: date,
          Value: habit.history[date]
        });
      }
    });
  });
  
  return rows;
}

function downloadCSV() {
  const rows = generateMonthlyData();
  
  if (rows.length === 0) {
    alert("No data for this month!");
    return;
  }
  
  const csv = "Habit,Date,Value\n" + 
    rows.map(r => `${r.Habit},${r.Date},${r.Value}`).join("\n");
  
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `habit_report_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

function downloadFullYearCSV() {
  const data = getData();
  const year = new Date().getFullYear();
  const rows = [];
  
  Object.keys(data.habitData || {}).forEach(habitId => {
    const habit = data.habitData[habitId];
    
    Object.keys(habit.history || {}).forEach(date => {
      const d = new Date(date);
      
      if (d.getFullYear() === year) {
        rows.push({
          Habit: habitId,
          Date: date,
          Value: habit.history[date]
        });
      }
    });
  });
  
  if (rows.length === 0) {
    alert("No data for this year!");
    return;
  }
  
  const csv = "Habit,Date,Value\n" + 
    rows.map(r => `${r.Habit},${r.Date},${r.Value}`).join("\n");
  
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `habit_full_year_${year}.csv`;
  link.click();
}

function downloadJSON() {
  const data = getData();
  
  const exportData = {
    balance: data.balance,
    streak: data.streak,
    disciplineScore: data.disciplineScore,
    habitData: data.habitData,
    dailyLogs: data.dailyLogs,
    history: data.history,
    exportDate: new Date().toISOString()
  };
  
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `habit_backup_${new Date().toISOString().split("T")[0]}.json`;
  link.click();
}
