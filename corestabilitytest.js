// Controleer of het document volledig is geladen voordat functies worden uitgevoerd
document.addEventListener('DOMContentLoaded', () => {
    displayCoreTestLog(); // Toon opgeslagen testresultaten bij het laden van de pagina
});

/**
 * Functie om de Core Stability Test resultaten op te slaan in localStorage
 */
function saveCoreStabilityTest() {
    // Haal waarden op uit het formulier
    const coreTestDate = document.getElementById('coreTestDate').value;
    const rightPlank = document.getElementById('rightPlank').value;
    const leftPlank = document.getElementById('leftPlank').value;
    const forearmPlank = document.getElementById('forearmPlank').value;

    // Validatie om te controleren of alle velden zijn ingevuld en geldig
    if (!coreTestDate) {
        alert('Voer alstublieft een datum in.');
        return;
    }
    if (!rightPlank || rightPlank <= 0) {
        alert('Voer alstublieft een geldige tijd in voor Side-Plank (Rechts).');
        return;
    }
    if (!leftPlank || leftPlank <= 0) {
        alert('Voer alstublieft een geldige tijd in voor Side-Plank (Links).');
        return;
    }
    if (!forearmPlank || forearmPlank <= 0) {
        alert('Voer alstublieft een geldige tijd in voor Forearm Plank.');
        return;
    }

    // Maak een object met de testresultaten
    const newTest = {
        date: coreTestDate,
        rightPlank: parseInt(rightPlank),
        leftPlank: parseInt(leftPlank),
        forearmPlank: parseInt(forearmPlank)
    };

    // Haal bestaande testresultaten op uit localStorage of maak een nieuwe array
    let coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    // Voeg de nieuwe test toe aan de array
    coreData.push(newTest);

    // Sla de bijgewerkte array op in localStorage
    localStorage.setItem('coreData', JSON.stringify(coreData));

    // Toon een succesmelding
    alert('Core Stability Test resultaten succesvol opgeslagen!');

    // Reset het formulier na succesvolle opslag
    document.getElementById('coreTestForm').reset();

    // Werk de weergegeven testresultaten bij
    displayCoreTestLog();
}

/**
 * Functie om opgeslagen Core Stability Test resultaten weer te geven op de pagina
 */
function displayCoreTestLog() {
    const coreTestLog = document.getElementById('coreTestLog');
    const coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    // Maak de huidige inhoud leeg voordat nieuwe gegevens worden toegevoegd
    coreTestLog.innerHTML = '';

    if (coreData.length === 0) {
        coreTestLog.innerHTML = '<p>Geen testresultaten gevonden.</p>';
        return;
    }

    // Maak een tabel om de testresultaten overzichtelijk weer te geven
    const table = document.createElement('table');
    table.classList.add('test-table');

    // Maak de tabelkop
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Datum</th>
            <th>Side-Plank (Rechts) (sec)</th>
            <th>Side-Plank (Links) (sec)</th>
            <th>Forearm Plank (sec)</th>
            <th>Acties</th>
        </tr>
    `;
    table.appendChild(thead);

    // Maak de tabelbody
    const tbody = document.createElement('tbody');

    // Voeg elke testresultaat toe als een rij in de tabel
    coreData.forEach((test, index) => {
        const row = document.createElement('tr');

        // Format de datum naar een leesbaar formaat
        const formattedDate = new Date(test.date).toLocaleDateString('nl-NL');

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${test.rightPlank}</td>
            <td>${test.leftPlank}</td>
            <td>${test.forearmPlank}</td>
            <td>
                <button class="delete-button" onclick="deleteCoreTest(${index})">Verwijderen</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    coreTestLog.appendChild(table);
}

/**
 * Functie om een specifiek Core Stability Test resultaat te verwijderen uit localStorage
 * @param {number} index - De index van het testresultaat in de array
 */
function deleteCoreTest(index) {
    const confirmDelete = confirm('Weet je zeker dat je dit testresultaat wilt verwijderen?');

    if (!confirmDelete) return;

    let coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    // Verwijder het testresultaat op basis van de index
    coreData.splice(index, 1);

    // Werk localStorage bij met de nieuwe array
    localStorage.setItem('coreData', JSON.stringify(coreData));

    // Werk de weergegeven testresultaten bij
    displayCoreTestLog();
}

/**
 * Functie om terug te navigeren naar het dashboard
 */
function navigateToDashboard() {
    window.location.href = 'index.html';
}

