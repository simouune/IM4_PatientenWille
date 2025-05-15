console.log("medizinische-behandlung_1.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    ladeAntworten(); // Antworten vom Server laden

    document.getElementById('saveBtn').addEventListener('click', async function () {
        const antworten = [
            {
                frage_id: 101,
                antwort: document.querySelector('textarea[name="leben"]').value.trim()
            },
            {
                frage_id: 102,
                antwort: document.querySelector('textarea[name="lebensqualitaet"]').value.trim()
            },
            {
                frage_id: 103,
                antwort: document.querySelector('textarea[name="sterben"]').value.trim()
            },
            {
                frage_id: 104,
                antwort: document.querySelector('textarea[name="behandlung"]').value.trim()
            }
        ];

        console.log("Antworten:", antworten);

        try {
            const response = await fetch('api/medbehandlung1/createmedbehandlung1.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(antworten)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = "personalien.html";
            } else {
                alert(result.message || "Fehler beim Speichern");
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert("Etwas ist schief gelaufen!");
        }
    });
});

// Antworten beim Laden der Seite holen und in die Textareas einfügen
async function ladeAntworten() {
    try {
        const response = await fetch('api/medbehandlung1/readmedbehandlung1.php');
        const data = await response.json();

        if (data.success && Array.isArray(data.antworten)) {
            data.antworten.forEach(a => {
                if (a.frage_id == 101) document.querySelector('textarea[name="leben"]').value = a.antwort;
                if (a.frage_id == 102) document.querySelector('textarea[name="lebensqualitaet"]').value = a.antwort;
                if (a.frage_id == 103) document.querySelector('textarea[name="sterben"]').value = a.antwort;
                if (a.frage_id == 104) document.querySelector('textarea[name="behandlung"]').value = a.antwort;
            });
        }
    } catch (error) {
        console.error("Fehler beim Laden der Antworten:", error);
    }
}

 document.getElementById('saveBtn').addEventListener('click', async () => {
        const success = await saveData();
        if (success) {
            window.location.href = "medbehandlung2.html";  // Gehe zur nächsten Seite
        }
    });

    document.getElementById('zwischenspeicherBtn').addEventListener('click', async () => {
        const success = await saveData();
        if (success) {
            window.location.href = "uebersicht.html";  // Gehe zur Übersichtsseite
        }
    });
