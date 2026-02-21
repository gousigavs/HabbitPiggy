function updateHabitStreak(habitId, frequency, data) {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const habit = data.habitData[habitId] || { history: {}, streak: 0 };

  let newStreak = habit.streak;

  if (frequency === "daily") {
    if (habit.history[yesterday]) {
      newStreak += 1;
    } else if (!habit.history[yesterday] && habit.streak > 0) {
      newStreak = 1;
    } else {
      newStreak = 1;
    }
  } else if (frequency === "weekly" || frequency === "biweekly") {
    newStreak += 1;
  }

  return newStreak;
}

function recordHabitCompletion(habitId, value, frequency) {
  const data = getData();
  const today = getTodayKey();

  const newStreak = updateHabitStreak(habitId, frequency, data);

  if (!data.habitData[habitId]) {
    data.habitData[habitId] = { history: {}, streak: 0 };
  }

  data.habitData[habitId].streak = newStreak;
  data.habitData[habitId].history[today] = value;

  saveData(data);

  return newStreak;
}

function getHabitStreak(habitId) {
  const data = getData();
  return data.habitData[habitId]?.streak || 0;
}

function checkStreakReset() {
  const data = getData();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  // Only reset if we haven't submitted today yet
  if (data.dailyLogs[today]) {
    return; // Already submitted today, don't reset
  }

  // Check each habit's streak
  Object.keys(data.habitData).forEach(id => {
    const habit = data.habitData[id];
    
    // Find the last date this habit was completed
    const historyDates = Object.keys(habit.history).sort().reverse();
    const lastCompleted = historyDates[0];
    
    // If last completion wasn't yesterday, reset streak
    if (lastCompleted !== yesterday && habit.streak > 0) {
      habit.streak = 0;
    }
  });

  saveData(data);
}


function getMultiplier(streak) {
  const multipliers = [
    { min: 1, max: 6, value: 1 },
    { min: 7, max: 13, value: 1.1 },
    { min: 14, max: 29, value: 1.25 },
    { min: 30, max: 59, value: 1.5 },
    { min: 60, max: Infinity, value: 1.75 }
  ];
  
  for (let tier of multipliers) {
    if (streak >= tier.min && streak <= tier.max) {
      return tier.value;
    }
  }
  return 1;
}
