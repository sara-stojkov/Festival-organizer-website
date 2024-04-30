function fetchCardDataAndGenerateCards() {
    fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            generateCardsFromData(data);
        }
    })
    .catch(error => {
        console.error('Error fetching card data:', error);
    });
}

function generateCardsFromData(cardData) {
    const container = document.getElementById('sve-kartice');
    let cardCount = 0;

    Object.entries(cardData).forEach(([key, value]) => {
        if (cardCount % 3 === 0) {
            const row = document.createElement('div');
            row.className = 'row';
            container.appendChild(row);
        }
        
        const card = document.createElement('div');
        card.className = 'card column';

        card.innerHTML = `
            <img src="${value.logo}" alt="${value.naziv}" class="cardimg">
            <h2 class="cardtitle content">${value.naziv}</h2>
            <button class="linkbtn" type="button" ><a href="../organizatori/organizator.html?key=${key}" class="btnlinks">Idi na stranicu</a></button>
        `;
        
        container.lastChild.appendChild(card);
        cardCount++;
    });
}

fetchCardDataAndGenerateCards();

