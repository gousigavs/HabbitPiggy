document.addEventListener("DOMContentLoaded", () => {
  renderHeatmap();
});

function renderHeatmap() {
  const data = getData();
  const container = document.getElementById("heatmap");
  
  const days = 120;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    
    const intensity = getIntensity(dateKey, data.habitData);
    
    const div = document.createElement("div");
    div.className = `heat ${getLevel(intensity)}`;
    div.title = `${dateKey}: ${intensity} activities`;
    
    container.appendChild(div);
  }
}

function getIntensity(dateKey, habitData) {
  let total = 0;
  
  if (!habitData) return 0;
  
  Object.values(habitData).forEach(habit => {
    if (habit.history && habit.history[dateKey]) {
      const value = habit.history[dateKey];
      if (typeof value === "number") {
        total += value;
      } else if (value === true) {
        total += 1;
      }
    }
  });
  
  return total;
}

function getLevel(intensity) {
  if (intensity === 0) return "level0";
  if (intensity < 3) return "level1";
  if (intensity < 6) return "level2";
  return "level3";
}
