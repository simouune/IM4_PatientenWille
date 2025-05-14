// _______________________________________________________________
// Daten zur Datenbank hinzufügen - CREATE Operation
// _______________________________________________________________

// DOM-Elemente für die Eingabefelder und den Speichern-Button auswählen
const inputFirstName = document.querySelector('#inputFirstName');
const inputLastName = document.querySelector('#inputLastName');
const inputBirthdate = document.querySelector('#inputBirthdate');
const inputStreet = document.querySelector('#inputStreet');
const inputPostcode = document.querySelector('#inputPostcode');
const inputCity = document.querySelector('#inputCity');
const inputPhone = document.querySelector('#inputPhone');
const saveButton = document.querySelector('#btnSave');

// Speichert die eingegebenen Daten in der Datenbank
saveButton.addEventListener('click', async () => {
    // Benutzereingaben auslesen
    let firstname = inputFirstName.value;
    let lastname = inputLastName.value;
    let birthdate = inputBirthdate.value;
    let street = inputStreet.value;
    let postcode = inputPostcode.value;
    let city = inputCity.value;
    let phone = inputPhone.value;
    
    // API-Endpoint für das Erstellen von Profildaten
    const url = '/api/profile/createProfile.php';
    
    // Daten-Objekt für die API-Anfrage erstellen
    const data = {
        firstname: firstname,
        lastname: lastname,
        birthdate: birthdate,
        street: street,
        postcode: postcode,
        city: city,
        phone: phone
    };

    console.log("Daten, die gesendet werden:", data);
    
    // Daten zur API senden und Ergebnis abwarten
    const dataAdded = await addData(url, data);
    console.log(dataAdded);

    
    // Wenn erfolgreich gespeichert: Seite neu laden, um aktualisierte Daten anzuzeigen
    /*if (dataAdded && !dataAdded.error) {
        window.location.reload();
    }*/
});

/**
 * Sendet Daten per POST-Anfrage an die API
 * 
 * @param {string} url - API-Endpoint
 * @param {Object} data - Zu sendende Daten
 * @returns {Object} API-Antwort oder Fehlerinformationen
 */

async function addData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json(); //enthält evtl. Error-Meldung
    } catch (error) {
        console.error(error);

        // Fehlermeldung im HTML anzeigen
        const fehlermeldungElement = document.querySelector('#fehlermeldung');
        if (fehlermeldungElement) {
            fehlermeldungElement.textContent = 'Fehler beim Senden der Daten an den Server.';        }

        return { error: 'Fehler beim Senden der Daten an den Server.' };
    }
}

saveButton.addEventListener('click', async () => {
    // Benutzereingaben auslesen
    let firstname = inputFirstName.value;
    let lastname = inputLastName.value;
    let birthdate = inputBirthdate.value;
    let street = inputStreet.value;
    let postcode = inputPostcode.value;
    let city = inputCity.value;
    let phone = inputPhone.value;

    const fehlermeldungElement = document.querySelector('#fehlermeldung');
    fehlermeldungElement.textContent = ''; // vorherige Fehlermeldung zurücksetzen

    const url = '/api/profile/createProfile.php';
    const data = {
        firstname,
        lastname,
        birthdate,
        street,
        postcode,
        city,
        phone
    };

    const dataAdded = await addData(url, data);

    // Wenn die API einen Fehler zurückmeldet, anzeigen
    if (dataAdded.error) {
        fehlermeldungElement.textContent = dataAdded.error;
        fehlermeldungElement.style.color = 'red';
        return;
    }

    // Wenn erfolgreich: Seite neu laden
    window.location.reload();
});


// ______________________________________________________________
// Daten der Datenbank anzeigen - READ Operation
// ______________________________________________________________

// Profildaten auslesen und in die Felder einfügen
async function loadProfile() {
    try {
        const response = await fetch('/api/profile/readProfile.php');
        const data = await response.json();

        if (data.error) {
            console.warn(data.error);
            return;
        }

        const user = data.user;

        // Werte ins Formular schreiben
        inputFirstName.value = user.firstname || '';
        inputLastName.value = user.lastname || '';
        inputBirthdate.value = user.birthdate || '';
        inputStreet.value = user.street || '';
        inputPostcode.value = user.postcode || '';
        inputCity.value = user.city || '';
        inputPhone.value = user.phone || '';
        inputEmail.value = user.email || '';XMLDocument

    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadProfile);

// ______________________________________________________________
// Daten aus der Datenbank updaten - UPDATE Operation
// ______________________________________________________________

// Button zum Speichern des Geburtsjahrs auswählen
const saveUpdateButton = document.querySelector('#btnSave');

/**
 * Event-Listener für den Button zum Aktualisieren des Geburtsjahrs
 * Sendet das aktualisierte Geburtsjahr an die API
 */
saveUpdateButton.addEventListener('click', async () => {
    // Eingabewert auslesen
    const firstname = inputFirstName.value;
    const lastname = inputLastName.value;
    const birthdate = inputBirthdate.value;
    const street = inputStreet.value;
    const postcode = inputPostcode.value;
    const city = inputCity.value;
    const phone = inputPhone.value;
    const email = document.querySelector('#inputEmail')?.value || ''; // Sicherstellen, dass das Email-Feld existiert

    // API-Endpoint für das Aktualisieren von Profildaten
    const url = '/api/profile/updateProfile.php';

    // Daten-Objekt für die API-Anfrage erstellen
    const data = {
        firstname: firstname,
        lastname: lastname,
        birthdate: birthdate,
        street: street, 
        postcode: postcode,
        city: city,
        phone: phone,
        email: email
    };

    // Daten zur API senden und Ergebnis abwarten
    const dataUpdated = await updateData(url, data);
    console.log(dataUpdated);

    // Wenn erfolgreich aktualisiert: Seite neu laden, um aktualisierte Daten anzuzeigen
    if (dataUpdated && !dataUpdated.error) {
        window.location.reload();
    }
});

/**
 * Sendet Daten per PUT-Anfrage an die API
 * 
 * @param {string} url - API-Endpoint
 * @param {Object} data - Zu aktualisierende Daten
 * @returns {Object} API-Antwort oder Fehlerinformationen
 */
async function updateData(url, data) {
    try {
        // PUT-Anfrage mit JSON-Daten senden
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        // Fehler abfangen und strukturierte Fehlermeldung zurückgeben
        console.error(error);
        return { error: 'Failed to update data' };
    }
}
