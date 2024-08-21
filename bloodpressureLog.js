function addBloodPressure() {
    const bpDate = document.getElementById('bpDate').value;
    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);

    if (!bpDate || isNaN(systolic) || isNaN(diastolic)) {
        alert('Vul alle velden correct in.');
        return;
    }

    let bpData = JSON.parse(localStorage.getItem('bpData')) || [];

    const newEntry = {
        date: bpDate,
        systolic: systolic,
        diastolic: diastolic
    };

    bpData.push(newEntry);
    localStorage.setItem('bpData', JSON.stringify(bpData));
    alert('Bloeddruk toegevoegd!');
    displayBloodPressureLog();
    displayBPChart();
    updateBPIndicator(); // Update de stoplichtindicator
}

function displayBloodPressureLog() {
    const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    const bpResults = document.getElementById('bloodPressureResults');
    bpResults.innerHTML = '';

    bpData.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `
            <strong>Datum:</strong> ${entry.date}<br>
            <strong>Systolische Bloeddruk:</strong> ${entry.systolic} mmHg<br>
            <strong>Diastolische Bloeddruk:</strong> ${entry.diastolic} mmHg<br>
            <button onclick="deleteBloodPressure(${index})">Verwijderen</button>
            <hr>
        `;
        bpResults.appendChild(entryElement);
    });
}

function deleteBloodPressure(index) {
    let bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    bpData.splice(index, 1); // Verwijder het bloeddrukresultaat op de opgegeven index
    localStorage.setItem('bpData', JSON.stringify(bpData)); // Update localStorage
    displayBloodPressureLog(); // Update de weergave na verwijdering
    displayBPChart(); // Update de grafiek na verwijdering
    updateBPIndicator(); // Update de stoplichtindicator na verwijdering
}

function displayBPChart() {
    const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    if (bpData.length === 0) {
        return;
    }

    const labels = bpData.map(entry => entry.date);
    const systolicValues = bpData.map(entry => entry.systolic);
    const diastolicValues = bpData.map(entry => entry.diastolic);

    const ctx = document.getElementById('bpChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolische Bloeddruk (mmHg)',
                    data: systolicValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Diastolische Bloeddruk (mmHg)',
                    data: diastolicValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bloeddruk (mmHg)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

function updateBPIndicator() {
    const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    if (bpData.length === 0) {
        return;
    }

    const latestEntry = bpData[bpData.length - 1];
    const systolic = latestEntry.systolic;
    const diastolic = latestEntry.diastolic;

    const indicator = document.getElementById('bpIndicator'); // Zorg dat dit ID correct is

    if (systolic < 120 && diastolic < 80) {
        indicator.style.backgroundColor = 'green'; // Normale bloeddruk
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
        indicator.style.backgroundColor = 'orange'; // Verhoogde bloeddruk
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        indicator.style.backgroundColor = 'red'; // Hypertensie stadium 1
    } else if (systolic >= 140 || diastolic >= 90) {
        indicator.style.backgroundColor = 'darkred'; // Hypertensie stadium 2
    } else if (systolic > 180 || diastolic > 120) {
        indicator.style.backgroundColor = 'purple'; // Hypertensieve crisis (gevaarlijk)
    }
}

window.onload = function() {
    displayBloodPressureLog(); // Toon opgeslagen bloeddrukgegevens bij het laden van de pagina
    displayBPChart(); // Toon de grafiek bij het laden van de pagina
    updateBPIndicator(); // Update de stoplichtindicator bij het laden van de pagina
};


