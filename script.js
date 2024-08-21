function saveUserDetails() {
    const userName = document.getElementById('userName').value;
    const userBirthdate = document.getElementById('userBirthdate').value;
    const userHeight = parseFloat(document.getElementById('userHeight').value);

    if (!userName || !userBirthdate || isNaN(userHeight)) {
        alert('Vul alle velden correct in.');
        return;
    }

    const userDetails = {
        name: userName,
        birthdate: userBirthdate,
        height: userHeight
    };

    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    showSavedUserDetails();
    alert('Persoonsgegevens opgeslagen!');
}

function showSavedUserDetails() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (userDetails) {
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('savedUserDetails').style.display = 'block';

        document.getElementById('displayUserName').innerText = userDetails.name;
        document.getElementById('displayUserBirthdate').innerText = new Date(userDetails.birthdate).toLocaleDateString();
        document.getElementById('displayUserHeight').innerText = userDetails.height;

        document.getElementById('navigation').style.display = 'block';
        document.getElementById('summarySection').style.display = 'block'; // Zorg dat de samenvatting zichtbaar wordt
    }
}

function editUserDetails() {
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('savedUserDetails').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('summarySection').style.display = 'none'; // Verberg de samenvatting als je gaat bewerken
}

function navigateTo(page) {
    window.location.href = page;
}

function setIndicatorColor(indicatorId, score, thresholds) {
    const indicator = document.getElementById(indicatorId);
    
    if (score >= thresholds.good) {
        indicator.style.backgroundColor = 'green';
    } else if (score >= thresholds.average) {
        indicator.style.backgroundColor = 'orange';
    } else {
        indicator.style.backgroundColor = 'red';
    }
}

function updateIndicators() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    if (weightData.length > 0) {
        const latestWeight = weightData[weightData.length - 1].weight;
        setIndicatorColor('weightIndicator', latestWeight, { good: 70, average: 85 });
    }

    if (bloodPressureData.length > 0) {
        const latestBP = bloodPressureData[bloodPressureData.length - 1];
        const bpScore = (latestBP.systolic + latestBP.diastolic) / 2;
        setIndicatorColor('bpIndicator', bpScore, { good: 120, average: 140 });
    }

    if (cooperData.length > 0) {
        const latestCooper = cooperData[cooperData.length - 1].distance;
        setIndicatorColor('cooperIndicator', latestCooper, { good: 2800, average: 2200 });
    }

    if (coreData.length > 0) {
        const latestCore = coreData[coreData.length - 1];
        const coreScore = (latestCore.right + latestCore.left + latestCore.forearm) / 3;
        setIndicatorColor('coreIndicator', coreScore, { good: 90, average: 60 });
    }
}

window.onload = function() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
        showSavedUserDetails();
    }
    updateIndicators();
};

function generateSummary() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const coreData = JSON.parse(localStorage.getItem('coreData')) || [];

    let summary = "<h3>Samenvatting:</h3>";

    if (userDetails) {
        summary += `<p><strong>Naam:</strong> ${userDetails.name}</p>`;
        summary += `<p><strong>Geboortedatum:</strong> ${new Date(userDetails.birthdate).toLocaleDateString()}</p>`;
        summary += `<p><strong>Lengte:</strong> ${userDetails.height} cm</p>`;
    }

    if (weightData.length > 0) {
        const latestWeight = weightData[weightData.length - 1].weight;
        summary += `<p><strong>Laatste Gewicht:</strong> ${latestWeight} kg</p>`;
    } else {
        summary += "<p><strong>Laatste Gewicht:</strong> Geen gegevens beschikbaar.</p>";
    }

    if (bloodPressureData.length > 0) {
        const latestBP = bloodPressureData[bloodPressureData.length - 1];
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


