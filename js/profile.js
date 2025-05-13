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