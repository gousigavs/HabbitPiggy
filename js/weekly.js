function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  const weekNumber = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNumber}`;
}

function updateWeeklyProgress(date, restroomCount, crochetHours) {
  const data = getData();
  const weekKey = getWeekKey(date);

  if (!data.weeklyLogs[weekKey]) {
    data.weeklyLogs[weekKey] = {
      restroom: 0,
      crochet: 0,
      rewarded: false
    };
  }

  data.weeklyLogs[weekKey].restroom += restroomCount;
  data.weeklyLogs[weekKey].crochet += crochetHours;

  saveData(data);
}

function checkWeeklyReward(date) {
  const data = getData();
  const weekKey = getWeekKey(date);
  const weekData = data.weeklyLogs[weekKey];

  if (!weekData || weekData.rewarded) return;

  let reward = 0;

  if (weekData.restroom >= 3) {
    reward += CONFIG.weeklyReward;
  }

  if (weekData.crochet >= 2) {
    reward += CONFIG.weeklyReward;
  }

  if (reward > 0) {
    data.balance += reward;
    data.disciplineScore += 10;

    data.history.push({
      date,
      earned: reward,
      penalty: 0,
      balance: data.balance
    });

    weekData.rewarded = true;
  }

  saveData(data);
}

function getBiweeklyKey(dateStr) {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  const diffDays = Math.floor((date - start) / 86400000);
  const period = Math.floor(diffDays / 14);
  return `${date.getFullYear()}-B${period}`;
}

function updateBiweeklyCooking(date) {
  const data = getData();
  const key = getBiweeklyKey(date);

  if (!data.biweeklyLogs[key]) {
    data.biweeklyLogs[key] = {
      cooked: 0,
      rewarded: false
    };
  }

  data.biweeklyLogs[key].cooked += 1;

  saveData(data);
}

function checkBiweeklyReward(date) {
  const data = getData();
  const key = getBiweeklyKey(date);
  const entry = data.biweeklyLogs[key];

  if (!entry || entry.rewarded) return;

  if (entry.cooked >= 1) {
    data.balance += CONFIG.biweeklyReward;
    data.disciplineScore += 15;

    data.history.push({
      date,
      earned: CONFIG.biweeklyReward,
      penalty: 0,
      balance: data.balance
    });

    entry.rewarded = true;
  }

  saveData(data);
}
