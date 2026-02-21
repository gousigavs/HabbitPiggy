document.addEventListener("DOMContentLoaded", () => {
  renderRecipes();
});

function getRecipes() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}

function addRecipe() {
  const dish = document.getElementById("dishName").value;
  const notes = document.getElementById("dishNotes").value;

  if (!dish) return;

  const recipes = getRecipes();
  recipes.unshift({
    date: new Date().toLocaleDateString(),
    dish,
    notes
  });

  localStorage.setItem("recipes", JSON.stringify(recipes));

  document.getElementById("dishName").value = "";
  document.getElementById("dishNotes").value = "";

  renderRecipes();
}

function renderRecipes() {
  const container = document.getElementById("recipeEntries");
  const recipes = getRecipes();

  container.innerHTML = recipes.map(r => `
    <div class="mini-card">
      <strong>${r.date}</strong>
      <p>Dish: ${r.dish}</p>
      <p>Notes: ${r.notes || "N/A"}</p>
    </div>
  `).join("");
}

function goHome() {
  window.location.href = "index.html";
}
