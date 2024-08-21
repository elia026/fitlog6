function savePersonalInfo() {
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const height = document.getElementById('height').value;

    if (!name || !birthdate || !height) {
        alert('Vul alle velden correct in.');
        return;
    }

    const personalInfo = {
        name: name,
        birthdate: birthdate,
        height: height
    };

    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    showSavedPersonalInfo();
    alert('Persoonsgegevens opgeslagen!');
}

function showSavedPersonalInfo() {
    const personalInfo = JSON.parse(localStorage.getItem('personalInfo'));
    if (personalInfo) {
        document.getElementById('name').value = personalInfo.name;
        document.getElementById('birthdate').value = personalInfo.birthdate;
        document.getElementById('height').value = personalInfo.height;

        const savedInfoDiv = document.getElementById('savedPersonalInfo');
        savedInfoDiv.innerHTML = `
            <p><strong>Naam:</strong> ${personalInfo.name}</p>
            <p><strong>Geboortedatum:</strong> ${new Date(personalInfo.birthdate).toLocaleDateString()}</p>
            <p><strong>Lengte:</strong> ${personalInfo.height} cm</p>
        `;
    }
}

function navigateTo(page) {
    window.location.href = page;
}

function updateWeightIndicator() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    if (weightData.length === 0) {
        return;
    }

    const latestEntry = weightData[weightData.length - 1];
    const weightDifference = latestEntry.weight - latestEntry.goal;

    const indicator = document.getElementById('weightIndicator');

    if (weightDifference <= 0) {
        indicator.style.backgroundColor = 'green'; // Gewichtsdoel bereikt of overschreden
    } else if (weightDifference > 0 && weightDifference <= 5) {
        indicator.style.backgroundColor = 'orange'; // Dicht bij het gewichtsdoel (binnen 5 kg)
    } else {
        indicator.style.backgroundColor = 'red'; // Ver van het gewichtsdoel (meer dan 5 kg)
    }
}

function updateBPIndicator() {
    const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    if (bpData.length === 0) {
        return;
    }

    const latestEntry = bpData[bpData.length - 1];
    const systolic = latestEntry.systolic;
    const diastolic = latestEntry.diastolic;

    const indicator = document.getElementById('bpIndicator');

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

function updateCooperIndicator() {
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    if (cooperData.length === 0) {
        return;
    }

    const latestEntry = cooperData[cooperData.length - 1].distance;
    const indicator = document.getElementById('cooperIndicator');

    if (latestEntry >= 2800) {
        indicator.style.backgroundColor = 'green'; // Uitstekende conditie
    } else if (latestEntry >= 2200 && latestEntry < 2800) {
        indicator.style.backgroundColor = 'orange'; // Gemiddelde conditie
    } else {
        indicator.style.backgroundColor = 'red'; // Slechte conditie
    }
}

function updateCoreIndicator() {
    const coreData = JSON.parse(localStorage.getItem('coreData')) || [];
    if (coreData.length === 0) {
        return;
    }

    const latestCore = coreData[coreData.length - 1];
    const coreScore = (latestCore.right + latestCore.left + latestCore.forearm) / 3;
    const indicator = document.getElementById('coreIndicator');

    if (coreScore >= 90) {
        indicator.style.backgroundColor = 'green'; // Goede core-stabiliteit
    } else if (coreScore >= 60 && coreScore < 90) {
        indicator.style.backgroundColor = 'orange'; // Gemiddelde core-stabiliteit
    } else {
        indicator.style.backgroundColor = 'red'; // Slechte core-stabiliteit
    }
}

function updateIndicators() {
    updateWeightIndicator();
    updateBPIndicator();
    updateCooperIndicator();
    updateCoreIndicator();
}

function generateSummary() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const bpData = JSON.parse(localStorage.getItem('bpData')) || [];
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    let summary = "<h3>Samenvatting:</h3>";

    if (weightData.length > 0) {
        const latestWeight = weightData[weightData.length - 1];
        summary += `<p><strong>Laatste Gewicht:</strong> ${latestWeight.weight} kg (Doel: ${latestWeight.goal} kg)</p>`;
    } else {
        summary += "<p><strong>Laatste Gewicht:</strong> Geen gegevens beschikbaar.</p>";
    }

    if (bpData.length > 0) {
        const latestBP = bpData[bpData.length - 1];
        summary += `<p><strong>Laatste Bloeddruk:</strong> ${latestBP.systolic}/${latestBP.diastolic} mmHg</p>`;
    } else {
        summary += "<p><strong>Laatste Bloeddruk:</strong> Geen gegevens beschikbaar.</p>";
    }

    if (cooperData.length > 0) {
        const latestCooper = cooperData[cooperData.length - 1];
        summary += `<p><strong>Laatste Coopertest Afstand:</strong> ${latestCooper.distance} meter</p>`;
    } else {
        summary += "<p><strong>Laatste Coopertest Afstand:</strong> Geen gegevens beschikbaar.</p>";
    }

    if (coreData.length > 0) {
        const latestCore = coreData[coreData.length - 1];
        summary += `<p><strong>Laatste Core Stability Test:</strong> Side-Plank (Rechts): ${latestCore.right} sec, Side-Plank (Links): ${latestCore.left} sec, Forearm Plank: ${latestCore.forearm} sec</p>`;
    } else {
        summary += "<p><strong>Laatste Core Stability Test:</strong> Geen gegevens beschikbaar.</p>";
    }

    document.getElementById('testSummary').innerHTML = summary;
}

window.onload = function() {
    showSavedPersonalInfo();
    updateIndicators(); // Update alle indicatoren bij het laden van de pagina
};


