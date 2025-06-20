// _______________________________________________________________
// DOM-Elemente definieren
// _______________________________________________________________

const inputFirstName = document.querySelector('#inputFirstName');
const inputLastName = document.querySelector('#inputLastName');
const inputBirthdate = document.querySelector('#inputBirthdate');
const inputStreet = document.querySelector('#inputStreet');
const inputPostcode = document.querySelector('#inputPostcode');
const inputCity = document.querySelector('#inputCity');
const inputPhone = document.querySelector('#inputPhone');
const inputEmail = document.querySelector('#inputEmail');
const saveButton = document.querySelectorAll('.btnSave');
const fehlermeldungElement = document.querySelector('#fehlermeldung');


// _______________________________________________________________
// CREATE & UPDATE Operation – Speichern-Button
// _______________________________________________________________

const saveButtons = document.querySelectorAll('.btnSave, .btnSaveBack');

saveButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        fehlermeldungElement.textContent = '';

        const data = {
            firstname: inputFirstName.value,
            lastname: inputLastName.value,
            birthdate: inputBirthdate.value,
            street: inputStreet.value,
            postcode: inputPostcode.value,
            city: inputCity.value,
            phone: inputPhone.value
        };

        const urlCheck = '/api/profile/readProfile.php';
        const urlCreate = '/api/profile/createProfile.php';
        const urlUpdate = '/api/profile/updateProfile.php';

        let responseData;

        const profileExists = await checkIfProfileExists();

        if (profileExists) {
            responseData = await updateData(urlUpdate, data);
        } else {
            responseData = await addData(urlCreate, data);
        }

        if (responseData.error) {
            fehlermeldungElement.textContent = responseData.error;
            fehlermeldungElement.style.color = 'red';
            return;
        }

        // Weiterleitung nach erfolgreichem Speichern
        const nextPage = button.dataset.next || 'medizinische-behandlung_1.html';
        window.location.href = nextPage;
    });
});




// _______________________________________________________________
// Hilfsfunktionen
// _______________________________________________________________

async function checkIfProfileExists() {
    try {
        console.log('Prüfe, ob Profil existiert...');
        const response = await fetch('/api/profile/readProfile.php');
        console.log('Antwort vom Server erhalten:', response);
        const data = await response.json();
        return data?.user != null;
    } catch (error) {
        console.error('Fehler beim Prüfen des Profils:', error);
        return false;
    }
}

async function addData(url, data) {
    console.log('Daten an den Server senden:', data);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: 'Fehler beim Senden der Daten an den Server.' };
    }
}

async function updateData(url, data) {
    console.log('Daten aktualisieren:', data);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: 'Fehler beim Aktualisieren der Daten.' };
    }
}


// _______________________________________________________________
// READ Operation – Profildaten laden
// _______________________________________________________________

async function loadProfile() {
    try {
        const response = await fetch('/api/profile/readProfile.php');
        const data = await response.json();

        if (data.error) {
            console.warn(data.error);
            return;
        }

        const user = data.user;

        inputFirstName.value = user.firstname || '';
        inputLastName.value = user.lastname || '';
        inputBirthdate.value = user.birthdate || '';
        inputStreet.value = user.street || '';
        inputPostcode.value = user.postcode || '';
        inputCity.value = user.city || '';
        inputPhone.value = user.phone || '';
        inputEmail.value = user.email || '';  // Nur anzeigen, nicht speichern

    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadProfile);


