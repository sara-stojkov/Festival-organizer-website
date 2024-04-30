function generateOrganizerSite() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const organizerKey = urlParams.get('key');
    const firebaseURL = `https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerKey}.json`;

    fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerKey}.json`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.title = `${data.naziv}`;
                const headingElements = document.getElementById('heading-organizator');

                headingElements.innerHTML = `
                    <img src="${data.logo}" id="organizator-slika" style="width: 100%;" class="mainpage-image"/>
                    <div class="overlay-text"><h1 id="naziv-organizatora">${data.naziv}</h1></div>
                `;

                const aboutElements = document.getElementById('organizatorInfo');

                aboutElements.innerHTML = `
                    <p class="orginfo" style="margin-left: 2vw; font-size: x-large;"> Naziv: ${data.naziv} <br/>
                    Adresa:  ${data.adresa} <br/>
                    Godina osnivanja:  ${data.godinaOsnivanja} <br/>
                    Kontakt telefon:  ${data.kontaktTelefon} <br/>
                    Email: ${data.email} <br/>
                    </p>
                `;

                fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${data.festivali}.json`)
                    .then(response => response.json())
                    .then(newdata => {
                        const cardContainer = document.getElementById('card-container');
                        let cardCount = 0;
                        let row;

                        Object.entries(newdata).forEach(([key, value]) => {
                            if (cardCount % 3 === 0) {
                                row = document.createElement('div');
                                row.className = 'row';
                                cardContainer.appendChild(row);
                            }

                            const cardDiv = document.createElement('div');
                            cardDiv.classList.add('card');

                            const anchorElement = document.createElement('a');
                            anchorElement.href = `festival.html?organizerKey=${data.festivali}&festivalKey=${key}`;

                            const imgElement = document.createElement('img');
                            imgElement.src = value.slike[0];
                            imgElement.classList.add('card-img-top');
                            imgElement.alt = 'Slika Festivala';

                            const cardBodyDiv = document.createElement('div');
                            cardBodyDiv.classList.add('card-body');

                            const cardTitle = document.createElement('h4');
                            cardTitle.classList.add('card-title');
                            cardTitle.textContent = value.naziv;

                            const cardText = document.createElement('p');
                            cardText.classList.add('card-text');
                            cardText.textContent = `${value.tip} festival, prevoz: ${value.prevoz}`;

                            cardBodyDiv.appendChild(cardTitle);
                            cardBodyDiv.appendChild(cardText);
                            anchorElement.appendChild(imgElement);
                            cardDiv.appendChild(anchorElement);
                            cardDiv.appendChild(cardBodyDiv);
                            row.appendChild(cardDiv);

                            cardCount++;
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                console.error('No data found at Firebase location:', firebaseURL);
            }
        })
        .catch(error => {
            console.error('Error fetching data from Firebase:', error);
        });
}

if (window.location.pathname.includes("organizator.html")) {
    generateOrganizerSite();

}

function searchFestivals() {
    const searchByNameCheckbox = document.querySelector('#searchByName');
    const searchByTypeCheckbox = document.querySelector('#searchByType');

    const searchQuery = document.getElementById('nameSearchBar').value.trim().toLowerCase();
    const searchType = document.querySelector('select[name="dropdown-type"]').value.toLowerCase();

    const searchResultContainer = document.getElementById('search-result-container');
    searchResultContainer.innerHTML = ''; // Clear previous search results

    const elements = document.querySelectorAll('.card');

    const searchByName = searchByNameCheckbox.checked;
    const searchByType = searchByTypeCheckbox.checked;

    let searchResults = [];

    if (searchByName) {
        searchResults.push([...elements].filter(element => {
            const titleElement = element.querySelector('.card-title');
            const title = titleElement.textContent.trim().toLowerCase();
            return searchQuery !== '' && title.includes(searchQuery);
        }));
    }

    if (searchByType) {
        searchResults.push([...elements].filter(element => {
            const typeElement = element.querySelector('.card-text');
            const type = typeElement.textContent.trim().toLowerCase();
            return searchType !== '' && type.includes(searchType);
        }));
    }

    let intersection = searchResults.reduce((acc, cur) => acc.filter(value => cur.includes(value)));

    if (intersection.length === 0) {
        const noResultMessage = document.createElement('h3');
        noResultMessage.textContent = 'Nema rezultata pretrage...';
        noResultMessage.classList.add('no-results');
        searchResultContainer.appendChild(noResultMessage);
    } else {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'justify-content-start'); // Add class to align cards to the left
        let cardCount = 0;

        intersection.forEach(element => {
            if (cardCount % 3 === 0) {
                rowDiv.innerHTML += '</div><div class="row justify-content-start">'; // Adjust row count for 2 cards per row
            }
            const clonedCard = element.cloneNode(true);
            highlightCard(clonedCard);
            rowDiv.appendChild(clonedCard);
            cardCount++;
        });

        searchResultContainer.appendChild(rowDiv);
    }
}

function highlightCard(card) {
    card.classList.add('highlight');
}

// kod za generisanje sajta festivala

if (window.location.pathname.includes("festival.html")) {
    generateFestivalSite();
}

function generateFestivalSite(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const organizerKey = urlParams.get('organizerKey');
    const festivalKey = urlParams.get('festivalKey');    

    fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${organizerKey}/${festivalKey}.json`)
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.title = `${data.naziv}`;
            const festivalInfoElements = document.getElementById('festInfo')
    
            festivalInfoElements.innerHTML = `
                <h1 id="nazivFestivala"><strong>${data.naziv}</strong></h1>
                <br>
                <article style="font-size: x-large;">${data.opis}</article>
                <hr/>
                <div class="info">
                    <div class="containerfests">Tip festivala: ${data.tip} <div class="festicon" id="typeIcon">
                    </div></div><br/>                    
                    <div class="containerfests">Prevoz:   ${data.prevoz}<div class="festicon" id="transportIcon"></div></div><br/> 
                    <div class="containerfests">Cena:   ${data.cena}<div class="festicon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-exchange" viewBox="0 0 16 16">
                        <path d="M0 5a5 5 0 0 0 4.027 4.905 6.5 6.5 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05q-.001-.07.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.5 3.5 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98q-.004.07-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5m16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674z"/>
                      </svg></div></div><br/>
                    <div class="containerfests">Max osoba:   ${data.maxOsoba}<div class="festicon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                      </svg></div></div><br/>
                    </div>
                `;

                const typeIconContainer = document.getElementById('typeIcon');

                switch (data.tip.trim()) {  
                    case 'Muzički': 
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16">
                        <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                        <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                        <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                      </svg>`;
                      break;
                    case 'Umetnički':
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brush-fill" viewBox="0 0 16 16">
                        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
                      </svg>`;
                      break;
                    case 'Filmski':
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-reels-fill" viewBox="0 0 16 16">
                        <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M9 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                        <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
                      </svg>`;
                      break;
                    case 'Gastronomski':
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-egg-fried" viewBox="0 0 16 16">
                        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
                      </svg>`;
                        break;
                    case 'Edukativni':
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                      </svg>`;
                        break;
                    default:
                        typeIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-octagon" viewBox="0 0 16 16">
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                      </svg>`;
                }


                const transportIconContainer = document.getElementById('transportIcon');
                switch (data.prevoz) {
                    case 'Avion': 
                        transportIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane-fill" viewBox="0 0 16 16">
                        <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849"/>
                      </svg>`;
                      break;
                    case 'Autobus':
                        transportIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bus-front" viewBox="0 0 16 16">
                        <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44 44 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43 43 0 0 0 8 3"/>
                        <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A44 44 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2zM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A43 43 0 0 1 8 1"/>
                      </svg>`;
                      break;
                    case 'Sopstveni':
                        transportIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16">
                        <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                      </svg>`;
                      break;
                    default:
                        transportIconContainer.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-octagon" viewBox="0 0 16 16">
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                      </svg>`;
                }

            const carouselInner = document.getElementById('carouselImages');
            let isFirstItem = true;

            Object.entries(data.slike).forEach(([key, value]) => {
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');

                if (isFirstItem) {
                    carouselItem.classList.add('active');
                    isFirstItem = false;
                }

                const imgContainer = document.createElement('div');
                imgContainer.classList.add('row'); 

                const img = document.createElement('img');
                img.src = value;
                img.classList.add('d-block', 'w-100');
                img.alt = '...';

                imgContainer.appendChild(img);
                carouselItem.appendChild(imgContainer);
                carouselInner.appendChild(carouselItem);
            });
        
        }
        else {
            console.error(`No data found at Firebase location: https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${organizerKey}/${festivalKey}.json`);

        }
    })
    .catch(error => {
        console.error('Error fetching data from Firebase:', error);
    });
}


