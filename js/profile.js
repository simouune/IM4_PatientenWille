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

        // Werte ins Formular schreiben
        inputFirstName.value = data.firstname || '';
        inputLastName.value = data.lastname || '';
        inputBirthdate.value = data.birthdate || '';
        inputStreet.value = data.street || '';
        inputPostcode.value = data.postcode || '';
        inputCity.value = data.city || '';
        inputPhone.value = data.phone || '';

    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
    }
}

// Seite: Profildaten direkt beim Laden einfügen
window.addEventListener('DOMContentLoaded', loadProfile);



/* async function loadData() {
    const url = '/api/profile/readProfile.php'; // mit korrekter API-URL ersetzen
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return false;
    }
}
const data = await loadData();
console.log(data); // gibt die Daten der API oder false in der Konsole aus

const domfirstName = document.querySelector('#firstName');
const domlastName = document.querySelector('#lastName');
const domemail = document.querySelector('#email');
const dombirthdate = document.querySelector('#birthdate');
const domstreet = document.querySelector('#street');
const dompostcode = document.querySelector('#postcode');
const domcity = document.querySelector('#city');
const domphone = document.querySelector('#phone');

function formatDateSwiss(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

domfirstName.innerHTML = data.user.firstname;
domlastName.innerHTML = data.user.lastname;
domemail.innerHTML = data.user.email;
dombirthdate.innerHTML = formatDateSwiss(data.user.birthdate); // Formatierung anwenden
domstreet.innerHTML = data.user.street;
dompostcode.innerHTML = data.user.postcode;
domcity.innerHTML = data.user.city;
domphone.innerHTML = data.user.phone;
 */

/*
// ______________________________________________________________
// Adding Vorname und Nachname to the Database
// ______________________________________________________________

const inputFirstName = document.querySelector('#inputFirstName');
const inputLastName = document.querySelector('#inputLastName');
const saveButton = document.querySelector('#btnSaveAdditionalInfos');

saveButton.addEventListener('click', async () => {
    let firstName = inputFirstName.value;
    let lastName = inputLastName.value;
    const url = '/api/profile/createProfile.php'; // mit korrekter API-URL ersetzen
    const data = {
        firstname: firstName,
        lastname: lastName
    };
    const dataAdded = await addData(url, data);
    console.log(dataAdded); // gibt die Antwort der API oder false in der Konsole aus
});

async function addData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            location.reload(); // Reload the page after successful POST
        } else {
            console.error('Failed to post data:', response.statusText);
        }
    } catch (error) {
        console.error(error);
        return false;
    }
} 
*/