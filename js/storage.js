const STORAGE_KEY = "habitPiggyData";

function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {
    balance: 0,
    streak: 0,
    disciplineScore: 0,
    history: [],
    dailyLogs: {},
    weeklyLogs: {},
    biweeklyLogs: {},
    habitData: {}
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}
