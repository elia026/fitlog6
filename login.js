// js/login.js

function checkAccessCode() {
    const accessCode = document.getElementById('accessCode').value;
    const correctCode = '3636';

    if (accessCode === correctCode) {
        window.location.href = 'index.html'; // Zorg ervoor dat index.html in dezelfde map staat
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
}
