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
        const errorMessage = encodeURIComponent(error.message);
        window.location.href = `fetch_error.html?message=${errorMessage}`;
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

function searchPage() {
    var searchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
    
    var highlights = document.querySelectorAll('.highlight');
    highlights.forEach(function(element) {
        element.classList.remove('highlight');
    });
    
    if (searchQuery === '') return;
    
    var elements = document.querySelectorAll('.content');
    elements.forEach(function(element) {
        const targetElement = document.getElementById('sve-kartice');
        targetElement.scrollIntoView({ behavior: 'smooth' });
        highlightTextInElement(element, searchQuery);
    });
  }
  
  function highlightTextInElement(element, searchQuery) {
    var nodesToProcess = [element];
    while (nodesToProcess.length > 0) {
        var node = nodesToProcess.shift();
        if (node.nodeType === Node.TEXT_NODE) {
            var text = node.nodeValue.toLowerCase();
            var index = text.indexOf(searchQuery);
            while (index !== -1) {
                var beforeText = node.nodeValue.substring(0, index);
                var matchedText = node.nodeValue.substring(index, index + searchQuery.length);
                var afterText = node.nodeValue.substring(index + searchQuery.length);
  
                var span = document.createElement('span');
                span.classList.add('highlight');
                span.appendChild(document.createTextNode(matchedText));
  
                if (beforeText) {
                    var beforeTextNode = document.createTextNode(beforeText);
                    node.parentNode.insertBefore(beforeTextNode, node);
                }
                node.parentNode.insertBefore(span, node);
                
                node.nodeValue = afterText;
                text = node.nodeValue.toLowerCase();
                index = text.indexOf(searchQuery);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0 && node.tagName.toLowerCase() !== 'button') {
            for (var i = 0; i < node.childNodes.length; i++) {
                nodesToProcess.push(node.childNodes[i]);
            }
        }
    }
  }

  
  if (window.location.pathname.includes("index.html")) {
      document.getElementById('searchbar').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        searchPage();
      }
    });
  }