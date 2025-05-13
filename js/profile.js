/**
 * Profilverwaltung JavaScript
 * 
 * Dieses Skript verwaltet die Benutzerprofile mit CRUD-Operationen (Create, Read, Update, Delete).
 * Es ermöglicht das Anzeigen, Erstellen, Aktualisieren und Löschen von Benutzerinformationen.
 * 
 * Ablauf:
 * 1. Authentifizierungsprüfung: Ist der Benutzer eingeloggt?
 * 2. Laden der Profildaten: Existiert bereits ein Profil?
 * 3. Event-Handler für CRUD-Operationen einrichten
 */

// _______________________________________________________________
// Authentifizierungsprüfung - Stellt sicher, dass der Benutzer eingeloggt ist
// _______________________________________________________________

/**
 * Prüft, ob der Benutzer authentifiziert ist
 * 
 * @returns {Object|boolean} Benutzerdaten bei erfolgreicher Authentifizierung, sonst false
 */
async function checkAuth() {
    try {
      // API-Anfrage mit Credentials senden (überträgt Cookies zur Authentifizierung)
      const response = await fetch("/api/protected.php", {
        credentials: "include",
      });
  
      // Wenn nicht authentifiziert (401), zur Login-Seite weiterleiten
      if (response.status === 401) {
        window.location.href = "/login.html";
        return false;
      }
  
      // Erfolgreiche Authentifizierung: Benutzerdaten zurückgeben
      const result = await response.json();
      return result;
    } catch (error) {
      // Bei Fehlern in der API-Anfrage: Fehler loggen und zur Login-Seite weiterleiten
      console.error("Auth check failed:", error);
      window.location.href = "/login.html";
      return false;
    }
  }
  
  /**
   * Selbstausführende asynchrone Funktion (IIFE)
   * Führt den Code nur aus, wenn die Authentifizierung erfolgreich war
   */
  (async function() {
    // Authentifizierung prüfen und abbrechen, wenn nicht erfolgreich
    const authResult = await checkAuth();
    if (!authResult) return; // Code-Ausführung stoppen, wenn nicht authentifiziert
  
    // _______________________________________________________________
    // Laden der Profildaten aus der API - READ Operation
    // _______________________________________________________________
  
    /**
     * Lädt Benutzerprofildaten von der API
     * 
     * @returns {Object} API-Antwort mit Benutzerdaten oder Fehlerinformationen
     */
    async function loadData() {
        const url = '/api/profile/readProfile.php'; // Endpoint für das Lesen von Profildaten
        try {
            // Fetch-API zum Laden der Daten verwenden
            const response = await fetch(url);
            
            // HTTP-Fehler abfangen (nicht 200-299)
            if (!response.ok) {
                return { error: `HTTP error! status: ${response.status}` };
            }
            
            // Erfolgreiche Antwort als JSON zurückgeben
            return await response.json();
        } catch (error) {
            // Netzwerk- oder JSON-Parsing-Fehler abfangen
            console.error(error);
            return { error: 'Failed to fetch data' };
        }
    }
  
    // Daten laden und Fehlerbehandlung
    let data;
    try {
        data = await loadData();
        console.log(data); // Daten zur Überprüfung in der Konsole ausgeben
    } catch (e) {
        // Unerwartete Fehler beim Laden abfangen
        console.error("Error loading data:", e);
        data = { error: e.message };
    }
  
    // DOM-Elemente für die Datenanzeige auswählen
    const domfirstName = document.querySelector('#firstName');
    const domlastName = document.querySelector('#lastName');
    const inputBirthYear = document.querySelector('#inputBirthday');
  
    /**
     * Daten im Benutzerinterface anzeigen
     * - Prüfen, ob gültige Benutzerdaten vorhanden sind
     * - Anzeigen der Daten oder einer Nachricht, wenn keine Daten vorhanden sind
     */
    if (data && !data.error && data.user && data.user.firstname) {
        // Wenn Benutzerdaten existieren: Daten in den DOM einfügen
        domfirstName.innerHTML = data.user.firstname;
        domlastName.innerHTML = data.user.lastname;
        inputBirthYear.value = data.user.geburtsjahr || '';
    } else {
        // Wenn keine Benutzerdaten vorhanden: Standardnachricht anzeigen
        domfirstName.innerHTML = "No user information";
        domlastName.innerHTML = "No user information";
        inputBirthYear.value = "";
    }
  
    // _______________________________________________________________
    // Daten zur Datenbank hinzufügen - CREATE Operation
    // _______________________________________________________________
  
    // DOM-Elemente für die Eingabefelder und den Speichern-Button auswählen
    const inputFirstName = document.querySelector('#inputFirstName');
    const inputLastName = document.querySelector('#inputLastName');
    const inputBirthYear = document.querySelector('#inputBirthday');
    const inputStreet = document.querySelector('#inputStreet');
    const inputPostcode = document.querySelector('#inputPostcode');
    const inputCity = document.querySelector('#inputCity');
    const inputPhone = document.querySelector('#inputPhone');
    const saveButton = document.querySelector('#btnSaveAdditionalInfo');
  
    /**
     * Event-Listener für den Speichern-Button
     * Speichert die eingegebenen Daten in der Datenbank
     */
    saveButton.addEventListener('click', async () => {
        // Benutzereingaben auslesen
        let firstName = inputFirstName.value;
        let lastName = inputLastName.value;
        let birthYear = inputBirthYear.value;
        let street = inputStreet.value;
        let postcode = inputPostcode.value;
        let city = inputCity.value;
        let phone = inputPhone.value;
        
        // API-Endpoint für das Erstellen von Profildaten
        const url = '/api/profile/createProfile.php';
        
        // Daten-Objekt für die API-Anfrage erstellen
        const data = {
            firstname: firstName,
            lastname: lastName
            birthyear: birthYear,
            street: street,
            postcode: postcode,
            city: city,
            phone: phone
        };
        
        // Daten zur API senden und Ergebnis abwarten
        const dataAdded = await addData(url, data);
        console.log(dataAdded);
        
        // Wenn erfolgreich gespeichert: Seite neu laden, um aktualisierte Daten anzuzeigen
        if (dataAdded && !dataAdded.error) {
            window.location.reload();
        }
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
            // POST-Anfrage mit JSON-Daten senden
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            // Fehler abfangen und strukturierte Fehlermeldung zurückgeben
            console.error(error);
            return { error: 'Failed to add data' };
        }
    }
  
    // _______________________________________________________________
    // Daten aktualisieren - UPDATE Operation
    // _______________________________________________________________
  
    // Button zum Speichern des Geburtsjahrs auswählen
    const buttonUpdateUserData = document.querySelector('#buttonUpdateUserData');
  
    /**
     * Event-Listener für den Button zum Aktualisieren des Geburtsjahrs
     * Sendet das aktualisierte Geburtsjahr an die API
     */
    buttonUpdateUserData.addEventListener('click', async () => {
        // Eingabewert auslesen
        const firstNameInput = inputFirstName.value;
        const lastNameInput = inputLastName.value;
        const birthYearInput = inputBirthYear.value;
        const streetInput = inputStreet.value;
        const postcodeInput = inputPostcode.value;
        const cityInput = inputCity.value;
        const phoneInput = inputPhone.value;
        
        // API-Endpoint für das Aktualisieren von Profildaten
        const url = '/api/profile/updateProfile.php';
        
        // Daten-Objekt für die API-Anfrage erstellen
        const data = {
            firstname: firstNameInput,
            lastname: lastNameInput,
            birthyear: birthYearInput
            street: streetInput,
            postcode: postcodeInput,
            city: cityInput,
            phone: phoneInput
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
  
})();

/* AUSKOMMENTIERT
// ______________________________________________________________
// Loading data from the API
// ______________________________________________________________

async function loadData() {
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