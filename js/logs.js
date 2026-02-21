document.addEventListener("DOMContentLoaded", () => {
  renderCodeEntries();
  renderCrochetEntries();
});

function getCodeEntries() {
  return JSON.parse(localStorage.getItem("codeEntries")) || [];
}

function getCrochetEntries() {
  return JSON.parse(localStorage.getItem("crochetEntries")) || [];
}

function addCodeEntry() {
  const learned = document.getElementById("codeLearn").value;
  const revised = document.getElementById("codeRevise").value;

  if (!learned) return;

  const entries = getCodeEntries();
  entries.unshift({
    date: new Date().toLocaleDateString(),
    learned,
    revised
  });

  localStorage.setItem("codeEntries", JSON.stringify(entries));

  document.getElementById("codeLearn").value = "";
  document.getElementById("codeRevise").value = "";

  renderCodeEntries();
}

function addCrochetEntry() {
  const project = document.getElementById("crochetProject").value;
  const hours = document.getElementById("crochetHours").value;

  if (!project) return;

  const entries = getCrochetEntries();
  entries.unshift({
    date: new Date().toLocaleDateString(),
    project,
    hours
  });

  localStorage.setItem("crochetEntries", JSON.stringify(entries));

  document.getElementById("crochetProject").value = "";
  document.getElementById("crochetHours").value = "";

  renderCrochetEntries();
}

function renderCodeEntries() {
  const container = document.getElementById("codeEntries");
  const entries = getCodeEntries();

  container.innerHTML = entries.map(e => `
    <div class="mini-card">
      <strong>${e.date}</strong>
      <p>Learned: ${e.learned}</p>
      <p>Revised: ${e.revised || "N/A"}</p>
    </div>
  `).join("");
}

function renderCrochetEntries() {
  const container = document.getElementById("crochetEntries");
  const entries = getCrochetEntries();

  container.innerHTML = entries.map(e => `
    <div class="mini-card">
      <strong>${e.date}</strong>
      <p>Project: ${e.project}</p>
      <p>Hours: ${e.hours || "N/A"}</p>
    </div>
  `).join("");
}

function goHome() {
  window.location.href = "index.html";
}
