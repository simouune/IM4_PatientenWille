const answers = {};

function answerQuestion(id, value) {
  answers[id] = value;

  // Frage ausgrauen
  const element = document.querySelector(`[data-id="${id}"]`);
  element.classList.add("grayed");

  // Prüfen ob abhängige Fragen beeinflusst werden sollen
  checkDependencies();
}

function checkDependencies() {
  const questions = document.querySelectorAll(".question");

  questions.forEach((q) => {
    const id = q.dataset.id;

    // Wenn 1a "Nein", dann 1b & 1c ausgrauen
    if (answers["1a"] === false && (id === "1b" || id === "1c")) {
      q.classList.add("grayed");
    }
  });
}

function checkDependencies() {
  const questions = document.querySelectorAll(".question");

  questions.forEach((q) => {
    q.classList.remove("grayed"); // Reset

    const id = q.dataset.id;

    // Wenn 1a "Nein", dann 1b & 1c ausgrauen
    if (answers["1a"] === false && (id === "1b" || id === "1c")) {
      q.classList.add("grayed");
    }
  });
}

function answerQuestion(id, value) {
  answers[id] = value;

  // Frage ausgrauen
  const element = document.querySelector(`[data-id="${id}"]`);
  element.classList.add("grayed");

  // Abhängigkeiten prüfen
  checkDependencies();

  // Zur nächsten sichtbaren Frage scrollen
  scrollToNextVisibleQuestion(id);
}

function scrollToNextVisibleQuestion(currentId) {
  const questions = Array.from(document.querySelectorAll(".question"));
  const currentIndex = questions.findIndex(q => q.dataset.id === currentId);

  for (let i = currentIndex + 1; i < questions.length; i++) {
    if (!questions[i].classList.contains("grayed")) {
      questions[i].scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    }
  }
}