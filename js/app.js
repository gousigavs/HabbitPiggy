document.addEventListener("DOMContentLoaded", () => {
  loadCustomHabits();
  checkStreakReset();
  renderHabits();
  updateHeader();
  checkIfAlreadySubmittedToday();
});

function loadCustomHabits() {
  const saved = localStorage.getItem("customHabits");
  if (saved) {
    const habits = JSON.parse(saved);
    CONFIG.dailyHabits = habits.daily || CONFIG.dailyHabits;
    CONFIG.weeklyHabits = habits.weekly || CONFIG.weeklyHabits;
    CONFIG.biweeklyHabits = habits.biweekly || CONFIG.biweeklyHabits;
  }
}

function checkIfAlreadySubmittedToday() {
  const data = getData();
  const today = getTodayKey();
  
  if (data.dailyLogs[today]) {
    document.getElementById("submitDay").disabled = true;
    document.getElementById("submitDay").innerText = "Already Submitted Today";
    document.getElementById("submitDay").style.opacity = "0.5";
  }
}

function renderHabits() {
  const dailyContainer = document.getElementById("dailyHabits");
  const weeklyContainer = document.getElementById("weeklyHabits");
  const biweeklyContainer = document.getElementById("biweeklyHabits");
  const dontContainer = document.getElementById("dontHabits");

  dailyContainer.innerHTML = "";
  weeklyContainer.innerHTML = "";
  biweeklyContainer.innerHTML = "";
  dontContainer.innerHTML = "";

  CONFIG.dailyHabits.forEach(habit => {
    dailyContainer.appendChild(createHabitItem(habit));
  });

  CONFIG.weeklyHabits.forEach(habit => {
    weeklyContainer.appendChild(createHabitItem(habit));
  });

  CONFIG.biweeklyHabits.forEach(habit => {
    biweeklyContainer.appendChild(createHabitItem(habit));
  });

  CONFIG.dontHabits.forEach(habit => {
    dontContainer.appendChild(createDontItem(habit));
  });
}

function createHabitItem(habit) {
  const div = document.createElement("div");
  div.className = "habit-item";

  const streak = getHabitStreak(habit.id);

  if (habit.type === "count") {
    div.innerHTML = `
      <div style="flex: 1;">
        <span>${habit.label}</span>
        ${streak > 0 ? `<div class="streak">🔥 ${streak} days</div>` : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="number" value="0" min="0" max="10" data-id="${habit.id}" data-reward="${habit.reward}" data-frequency="${habit.frequency}" style="width: 60px;" />
        <button onclick="deleteHabit('${habit.id}', '${habit.frequency}')" class="delete-btn" title="Delete habit">🗑️</button>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div style="flex: 1;">
        <span>${habit.label}</span>
        ${streak > 0 ? `<div class="streak">🔥 ${streak} days</div>` : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" value="${habit.id}" data-reward="${habit.reward}" data-frequency="${habit.frequency}" />
        <button onclick="deleteHabit('${habit.id}', '${habit.frequency}')" class="delete-btn" title="Delete habit">🗑️</button>
      </div>
    `;
  }

  return div;
}

function createDontItem(habit) {
  const div = document.createElement("div");
  div.className = "habit-item";

  div.innerHTML = `
    <span>${habit.label}</span>
    <input type="checkbox" value="${habit.id}" data-penalty="${habit.penalty}" class="dont-checkbox" />
  `;

  return div;
}

document.getElementById("submitDay").addEventListener("click", () => {
  const date = getTodayKey();
  const data = getData();

  // Prevent duplicate submission
  if (data.dailyLogs[date]) {
    alert("You already submitted today!");
    return;
  }

  let totalEarned = 0;
  let totalPenalty = 0;
  let completed = [];
  let completedDaily = [];
  let brokenDonts = [];

  // Process daily habits
  CONFIG.dailyHabits.forEach(habit => {
    if (habit.type === "count") {
      const input = document.querySelector(`input[data-id="${habit.id}"]`);
      const count = parseInt(input.value) || 0;
      
      // Always record, even if 0 (for streak tracking)
      recordHabitCompletion(habit.id, count, habit.frequency);
      
      if (count > 0) {
        const earned = count * habit.reward;
        totalEarned += earned;
        completed.push(habit.id);
        completedDaily.push(habit.id);
      }
    } else {
      const checkbox = document.querySelector(`input[value="${habit.id}"]`);
      if (checkbox && checkbox.checked) {
        totalEarned += habit.reward;
        completed.push(habit.id);
        completedDaily.push(habit.id);
        recordHabitCompletion(habit.id, true, habit.frequency);
      }
    }
  });

  // Process weekly habits
  CONFIG.weeklyHabits.forEach(habit => {
    if (habit.type === "count") {
      const input = document.querySelector(`input[data-id="${habit.id}"]`);
      const count = parseInt(input.value) || 0;
      
      recordHabitCompletion(habit.id, count, habit.frequency);
      
      if (count > 0) {
        const earned = count * habit.reward;
        totalEarned += earned;
        completed.push(habit.id);
      }
    } else {
      const checkbox = document.querySelector(`input[value="${habit.id}"]`);
      if (checkbox && checkbox.checked) {
        totalEarned += habit.reward;
        completed.push(habit.id);
        recordHabitCompletion(habit.id, true, habit.frequency);
      }
    }
  });

  // Process biweekly habits
  CONFIG.biweeklyHabits.forEach(habit => {
    if (habit.type === "count") {
      const input = document.querySelector(`input[data-id="${habit.id}"]`);
      const count = parseInt(input.value) || 0;
      
      recordHabitCompletion(habit.id, count, habit.frequency);
      
      if (count > 0) {
        const earned = count * habit.reward;
        totalEarned += earned;
        completed.push(habit.id);
      }
    } else {
      const checkbox = document.querySelector(`input[value="${habit.id}"]`);
      if (checkbox && checkbox.checked) {
        totalEarned += habit.reward;
        completed.push(habit.id);
        recordHabitCompletion(habit.id, true, habit.frequency);
      }
    }
  });

  // Process don'ts
  CONFIG.dontHabits.forEach(habit => {
    const checkbox = document.querySelector(`.dont-checkbox[value="${habit.id}"]`);
    if (checkbox && !checkbox.checked) {
      totalPenalty += habit.penalty;
      brokenDonts.push(habit.id);
    }
  });

  // Bonus for completing all daily habits (must complete ALL including count > 0)
  const allDailyCompleted = completedDaily.length === CONFIG.dailyHabits.length;
  if (allDailyCompleted) {
    totalEarned += CONFIG.dailyFullBonus;
  }

  // Bonus for keeping all don'ts
  if (brokenDonts.length === 0) {
    totalEarned += CONFIG.dontBonus;
  }

  // Update global streak (only if ALL DAILY habits completed)
  const yesterday = getYesterdayKey();
  const yesterdayLog = data.dailyLogs[yesterday];
  
  if (allDailyCompleted) {
    if (yesterdayLog && yesterdayLog.habitsCompleted && 
        yesterdayLog.habitsCompleted.length === CONFIG.dailyHabits.length) {
      data.streak = (data.streak || 0) + 1;
    } else {
      data.streak = 1;
    }
  } else {
    // Streak broken
    if (data.streak > 0) {
      totalPenalty += CONFIG.penalties.streakBreak;
    }
    data.streak = 0;
  }

  // Apply streak multiplier to BOTH earnings and penalties
  const multiplier = getMultiplier(data.streak);
  totalEarned = Math.round(totalEarned * multiplier);

  const net = Math.max(totalEarned - totalPenalty, 0);

  // Update discipline score (only once, based on final results)
  if (allDailyCompleted) {
    data.disciplineScore = (data.disciplineScore || 0) + 10;
  } else {
    data.disciplineScore = (data.disciplineScore || 0) - 5;
  }
  
  // Adjust for don'ts
  data.disciplineScore -= brokenDonts.length * 3;

  data.balance = Math.max((data.balance || 0) + net, 0);

  data.dailyLogs[date] = {
    habitsCompleted: completedDaily,
    allCompleted: completed,
    dontsBroken: brokenDonts,
    earned: totalEarned,
    penalty: totalPenalty,
    streak: data.streak
  };

  data.history.push({
    date,
    earned: totalEarned,
    penalty: totalPenalty,
    balance: data.balance
  });

  // Check for 7-day streak celebration (only once per milestone)
  if (data.streak === 7 && !data.streak7Bonus) {
    const bonus = 20;
    data.balance += bonus;
    data.streak7Bonus = true;
    
    // Record bonus in history
    data.history.push({
      date,
      earned: bonus,
      penalty: 0,
      balance: data.balance,
      note: "7-day streak bonus"
    });
    
    alert("🎉 7 Day Streak! Bonus ₹20 Added!");
  }
  
  // Reset bonus flag when streak breaks
  if (data.streak === 0) {
    data.streak7Bonus = false;
  }

  saveData(data);

  showModal(net);
  updateHeader();
  checkIfAlreadySubmittedToday();
});

function updateHeader() {
  const data = getData();

  document.getElementById("streak").innerText = data.streak || 0;
  document.getElementById("balance").innerText = data.balance || 0;
  document.getElementById("score").innerText = data.disciplineScore || 0;

  const multiplier = getMultiplier(data.streak || 1);
  document.getElementById("multiplier").innerText = multiplier + "x";

  const percent = Math.min(((data.streak || 0) % 7) / 7 * 100, 100);
  document.getElementById("streakBar").style.width = percent + "%";
}

function showModal(amount) {
  document.getElementById("modalText").innerText =
    `You earned ₹${amount} today! Keep going 🔥`;

  document.getElementById("successModal").classList.add("show");
}

function closeModal() {
  document.getElementById("successModal").classList.remove("show");
}

function showAddHabitModal() {
  document.getElementById("addHabitModal").classList.add("show");
}

function closeAddHabitModal() {
  document.getElementById("addHabitModal").classList.remove("show");
  document.getElementById("habitName").value = "";
  document.getElementById("habitReward").value = "";
}

function addNewHabit() {
  const name = document.getElementById("habitName").value.trim();
  const type = document.getElementById("habitType").value;
  const frequency = document.getElementById("habitFrequency").value;
  const reward = parseInt(document.getElementById("habitReward").value);

  if (!name || !reward || reward <= 0) {
    alert("Please fill in all fields with valid values!");
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, "_");

  const newHabit = {
    id,
    label: name,
    type,
    frequency,
    reward
  };

  // Add to appropriate array
  if (frequency === "daily") {
    CONFIG.dailyHabits.push(newHabit);
  } else if (frequency === "weekly") {
    CONFIG.weeklyHabits.push(newHabit);
  } else if (frequency === "biweekly") {
    CONFIG.biweeklyHabits.push(newHabit);
  }

  // Save to localStorage
  saveCustomHabits();

  closeAddHabitModal();
  renderHabits();
  alert(`✅ Added "${name}" habit!`);
}

function deleteHabit(habitId, frequency) {
  if (!confirm("Are you sure you want to delete this habit? This will remove all its history.")) {
    return;
  }

  // Remove from appropriate array
  if (frequency === "daily") {
    CONFIG.dailyHabits = CONFIG.dailyHabits.filter(h => h.id !== habitId);
  } else if (frequency === "weekly") {
    CONFIG.weeklyHabits = CONFIG.weeklyHabits.filter(h => h.id !== habitId);
  } else if (frequency === "biweekly") {
    CONFIG.biweeklyHabits = CONFIG.biweeklyHabits.filter(h => h.id !== habitId);
  }

  // Remove from habit data
  const data = getData();
  if (data.habitData[habitId]) {
    delete data.habitData[habitId];
    saveData(data);
  }

  // Save to localStorage
  saveCustomHabits();

  renderHabits();
  alert("🗑️ Habit deleted!");
}

function saveCustomHabits() {
  localStorage.setItem("customHabits", JSON.stringify({
    daily: CONFIG.dailyHabits,
    weekly: CONFIG.weeklyHabits,
    biweekly: CONFIG.biweeklyHabits
  }));
}
