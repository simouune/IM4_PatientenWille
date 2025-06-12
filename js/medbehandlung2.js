document.addEventListener("DOMContentLoaded", () => {
  fetch('api/medbehandlung2/readmedbehandlung2.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const gespeicherteAntworten = data.antworten;

        Object.entries(gespeicherteAntworten).forEach(([frageId, antwort]) => {
          // Speichere als boolean ins answers-Objekt, damit der Rest weiter funktioniert
          answers[frageId] = (antwort === "Ja");

          // Frage visuell markieren
          const element = document.querySelector(`[data-id="${frageId}"]`);
          if (element) {
            element.classList.add("grayed");

            // Button "Ja" oder "Nein" markieren
            const button = element.querySelector(`[onclick="answerQuestion('${frageId}', ${answers[frageId]})"]`);
            if (button) {
              button.classList.add("selected");
            }
          }
        });

        checkDependencies();
      } else {
        console.error("Fehler beim Laden:", data);
      }
    })
    .catch(err => {
      console.error("Fehler beim Abrufen der gespeicherten Antworten:", err);
    });
});


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

  // Antwort an Server senden (optional, kann man auch nur bei Buttons machen)
  // sendAnswerToServer();
}

function checkDependencies() {
  const questions = document.querySelectorAll(".question");

  questions.forEach((q) => {
    q.classList.remove("grayed"); // Reset

    const id = q.dataset.id;

    if (answers["1a"] === false && (id === "1b" || id === "1c")) {
      q.classList.add("grayed");
    }
  });
}

// Antworten speichern (nur Radio-Buttons)
function collectAnswers() {
    const frageIds = ['1a', '1b', '1c', '1d'];
    return frageIds.map(id => {
        const checked = document.querySelector(`input[name="q${id}"]:checked`);
        return {
            frage_id: id,
            antwort: checked ? (checked.value === "ja" ? "Ja" : "Nein") : ""
        };
    }).filter(a => a.antwort); // Nur beantwortete speichern
}

async function sendAnswers(callback) {
    const antworten = collectAnswers();
    const response = await fetch('api/medbehandlung2/createmedbehandlung2.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(antworten)
    });
    const data = await response.json();
    if (callback) callback(data);
}

// Button-Elemente definieren (wichtig!)
const saveAndNextBtn = document.getElementById('saveAndNextBtn');
const saveAndExitBtn = document.getElementById('saveAndExitBtn');

saveAndNextBtn.addEventListener('click', () => {
  sendAnswers(() => {
    window.location.href = 'uebersicht.html'; // Hier deine Übersichtsseite eintragen
  });
});

saveAndExitBtn.addEventListener('click', () => {
  sendAnswers(() => {
    window.location.href = 'uebersicht.html'; // Gleiche oder andere Seite
  });
});

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('api/medbehandlung2/readmedbehandlung2.php');
    const data = await response.json();
    if(data.status === "success" && data.antworten) {
        Object.entries(data.antworten).forEach(([frageId, antwort]) => {
            const value = antwort.toLowerCase();
            const radio = document.querySelector(`input[name="q${frageId}"][value="${value}"]`);
            if(radio) radio.checked = true;
        });
    }
});

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
