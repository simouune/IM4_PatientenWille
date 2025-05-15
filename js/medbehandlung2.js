const answers = {};

function answerQuestion(id, value) {
  answers[id] = value;

  // Frage ausgrauen
  const element = document.querySelector(`[data-id="${id}"]`);
  element.classList.add("grayed");

  // Abhängigkeiten prüfen
  checkDependencies();

  // Zur nächsten sichtbaren Frage scrollen
  scrollToNextVisibleQuestion(id);

  // Antwort an Server senden
  sendAnswerToServer(id, value);
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

function sendAnswerToServer(frageId, antwort) {
  console.log("Sende an Server:", frageId, antwort); // Moved outside of headers
  fetch('api/save_answer.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      frage_id: frageId,
      antwort: antwort,
      benutzer_id: 123 // ⛳ TODO: dynamisch setzen (z. B. per Session)
    })
  })
  .then(response => response.text())
  .then(data => console.log('Server-Antwort:', data))
  .catch(error => console.error('Fehler beim Senden:', error));
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

//console.log("Sende an Server:", frageId, antwort);
// Moved outside of headers