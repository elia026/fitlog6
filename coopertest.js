// js/cooperTest.js

let cooperChart;

function addCooperTest() {
    const cooperDate = document.getElementById('cooperDate').value;
    const distance = parseInt(document.getElementById('distance').value);

    if (!cooperDate || isNaN(distance)) {
        alert('Vul alle velden correct in.');
        return;
    }

    let cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    
    cooperData.push({ date: cooperDate, distance: distance });

    localStorage.setItem('cooperData', JSON.stringify(cooperData));
    displayCooperLog();
    updateCooperChart();
    alert('Coopertestresultaten toegevoegd!');
}

function displayCooperLog() {
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const cooperLogResults = document.getElementById('cooperTestResults');
    cooperLogResults.innerHTML = '';

    cooperData.forEach((entry, index) => {
        const formattedDate = new Date(entry.date).toLocaleDateString();
        const div = document.createElement('div');
        div.innerHTML = `
            <span><strong>${formattedDate}:</strong> Afstand: ${entry.distance} meter</span>
            <button onclick="deleteCooperTest(${index})">Verwijderen</button>
        `;
        cooperLogResults.appendChild(div);
    });
}

function deleteCooperTest(index) {
    let cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    cooperData.splice(index, 1);

    localStorage.setItem('cooperData', JSON.stringify(cooperData));
    displayCooperLog();
    updateCooperChart();
    alert('Coopertestresultaten verwijderd!');
}

function updateCooperChart() {
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const dates = cooperData.map(entry => new Date(entry.date).toLocaleDateString());
    const distances = cooperData.map(entry => entry.distance);

    const ctx = document.getElementById('cooperChart').getContext('2d');

    if (cooperChart) {
        cooperChart.destroy();
    }

    cooperChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Afgelegde afstand (meters)',
                data: distances,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
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
                        text: 'Afstand (meters)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

window.onload = function() {
    displayCooperLog();
    updateCooperChart();
};



