function addWeight() {
    const weightDate = document.getElementById('weightDate').value;
    const currentWeight = parseFloat(document.getElementById('currentWeight').value);
    const goalWeight = parseFloat(document.getElementById('goalWeight').value);

    if (!weightDate || isNaN(currentWeight) || isNaN(goalWeight)) {
        alert('Vul alle velden correct in.');
        return;
    }

    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];

    const newEntry = {
        date: weightDate,
        weight: currentWeight,
        goal: goalWeight
    };

    weightData.push(newEntry);
    localStorage.setItem('weightData', JSON.stringify(weightData));
    alert('Gewicht toegevoegd!');
    displayWeightLog();
    displayWeightChart();
    updateWeightIndicator(); // Update de stoplichtindicator
}

function displayWeightLog() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const weightLogResults = document.getElementById('weightLogResults');
    weightLogResults.innerHTML = '';

    weightData.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `
            <strong>Datum:</strong> ${entry.date}<br>
            <strong>Huidig Gewicht:</strong> ${entry.weight} kg<br>
            <strong>Doelgewicht:</strong> ${entry.goal} kg<br>
            <button onclick="deleteWeight(${index})">Verwijderen</button>
            <hr>
        `;
        weightLogResults.appendChild(entryElement);
    });
}

function deleteWeight(index) {
    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    weightData.splice(index, 1); // Verwijder het gewicht op de opgegeven index
    localStorage.setItem('weightData', JSON.stringify(weightData)); // Update localStorage
    displayWeightLog(); // Update de weergave na verwijdering
    displayWeightChart(); // Update de grafiek na verwijdering
    updateWeightIndicator(); // Update de stoplichtindicator na verwijdering
}

function displayWeightChart() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    if (weightData.length === 0) {
        return;
    }

    const labels = weightData.map(entry => entry.date);
    const weights = weightData.map(entry => entry.weight);
    const goals = weightData.map(entry => entry.goal);

    const ctx = document.getElementById('weightChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Huidig Gewicht (kg)',
                    data: weights,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Doelgewicht (kg)',
                    data: goals,
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
                        text: 'Gewicht (kg)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

function updateWeightIndicator() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    if (weightData.length === 0) {
        return;
    }

    const latestEntry = weightData[weightData.length - 1];
    const weightDifference = latestEntry.weight - latestEntry.goal;

    const indicator = document.getElementById('weightIndicator'); // Zorg dat dit ID correct is

    if (weightDifference <= 0) {
        indicator.style.backgroundColor = 'green'; // Gewichtsdoel bereikt of overschreden
    } else if (weightDifference > 0 && weightDifference <= 5) {
        indicator.style.backgroundColor = 'orange'; // Dicht bij het gewichtsdoel (binnen 5 kg)
    } else {
        indicator.style.backgroundColor = 'red'; // Ver van het gewichtsdoel (meer dan 5 kg)
    }
}

window.onload = function() {
    displayWeightLog(); // Toon opgeslagen gewichtsgegevens bij het laden van de pagina
    displayWeightChart(); // Toon de grafiek bij het laden van de pagina
    updateWeightIndicator(); // Update de stoplichtindicator bij het laden van de pagina
};
