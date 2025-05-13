async function loadData() {
    const url = '/api/profile.php'; // mit korrekter API-URL ersetzen
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