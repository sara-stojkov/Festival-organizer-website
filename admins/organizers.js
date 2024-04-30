// Assuming you have already initialized Firebase and have a reference to your database
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIzbybru9FTtUBYQ-V9l5bboT6a9eOuDE",
    authDomain: "hasta-la-fiesta.firebaseapp.com",
    projectId: "hasta-la-fiesta",
    storageBucket: "hasta-la-fiesta.appspot.com",
    messagingSenderId: "1098342569306",
    appId: "1:1098342569306:web:ae62c7538d1a692203cf63"
  };

function loadOrganizers() {
  fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala.json')
  .then(response => response.json())
  .then(data => {
      if (data) {
          Object.keys(data).forEach(organizerId => {
              const organizerData = data[organizerId];
              const newRow = createOrganizerRow(organizerId, organizerData);
              document.getElementById('all-organizers').appendChild(newRow);
              createEditModalOrganizer(organizerId, organizerData);
          });
      }
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
}

function createOrganizerRow(organizerId, organizerData) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${organizerData.naziv}</td>
        <td>${organizerData.adresa}</td>
        <td>${organizerData.godinaOsnivanja}</td>
        <td><a href="${organizerData.logo}">${organizerData.logo}<a> </td>
        <td>${organizerData.kontaktTelefon}</td>
        <td>${organizerData.email}</td>
        <td><button type="button" class="edit-btn" onclick="showEditOrganizerDialog('${organizerId}')">Izmeni</button></td> 
        <td><button type="button" class="del-btn" onclick="showDeleteConfirmationOrganizer('${organizerId}')">Obriši</button></td>
    `;
    return newRow;
}
  
function createEditModalOrganizer(organizerId, organizerData) {
  const editModal = document.createElement('div');
  editModal.classList.add('modal');
  editModal.classList.add('edit-organizer-modal');
  const editModalContent = document.createElement('div');
  editModalContent.classList.add('modal-content');
  editModalContent.classList.add('edit-organizer-content'); 
  editModal.id = `EditDialog-organizer-${organizerId}`;
  editModal.style.display = 'none';


  editModalContent.innerHTML = `
      <span class="close" onclick="hideEditOrganizerDialog('${organizerId}')">&times;</span>
      <h2>Izmena organizatora i njegovih festivala</h2>
      <div class="row">
        <div class="col">
          <label for="name">Naziv:</label>
          <input type="text" id="edit-name-${organizerId}" name="name" value="${organizerData.naziv || ''}"><br>
          <label for="address">Adresa:</label>
          <input type="text" id="edit-address-${organizerId}" name="address" value="${organizerData.adresa || ''}"><br>
          <label for="year">Godina osnivanja:</label>
          <input type="number" id="edit-year-${organizerId}" name="year" value="${organizerData.godinaOsnivanja || ''}"><br>
          <label for="logo">Link do logoa:</label>
          <input type="text" id="edit-logo-${organizerId}" name="logo" value="${organizerData.logo || ''}"><br>
          <label for="phone">Kontakt telefon:</label>
          <input type="tel" id="edit-phone-${organizerId}" name="phone" value="${organizerData.kontaktTelefon || ''}"><br>
          <label for="birthdate">Email:</label>
          <input type="email" id="edit-email-${organizerId}" name="email" value="${organizerData.email || ''}"><br>
        </div>

        <div class="col buttons" id="festivals-organizer-${organizerId}">
        </div>
        <button type="button" class="confirmbtn" onclick="editOrganizer('${organizerId}')" style="align-self: center;">Izmeni</button>
        <button type="button" class="cancelbtn edit-org-cancel" onclick="hideEditOrganizerDialog('${organizerId}')">Otkaži</button>
      </div>

  `;

  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${organizerData.festivali}.json`)
    .then(response => response.json())
    .then(newdata => {
        const festivalsContainer = document.getElementById(`festivals-organizer-${organizerId}`);


        Object.entries(newdata).forEach(([key, value]) => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            const h3Element = document.createElement('h3');
            h3Element.textContent = value.naziv;

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.classList.add('del-btn', 'small-btn', 'festdelbtn');
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                      </svg>`;
              deleteButton.onclick = () => {
                if (window.confirm("Da li ste sigurni da želite da ga obrišete?")) {
                    deleteFestival(organizerData.festivali, key);
                }
            };            
            rowDiv.appendChild(h3Element);
            rowDiv.appendChild(deleteButton);


            festivalsContainer.appendChild(rowDiv);

        });
        
        const hrElement = document.createElement('hr');
        festivalsContainer.appendChild(hrElement);

        const newFestivalButton = document.createElement('button');
        newFestivalButton.type = 'button';
        newFestivalButton.classList.add('small-btn');
        newFestivalButton.classList.add('new-btn');
        newFestivalButton.innerHTML = '+ Novi festival';
        newFestivalButton.onclick = function() {
          showNewFestivalDialog(organizerData.festivali, organizerId);
        };

        festivalsContainer.appendChild(newFestivalButton);

    })
    .catch(error => console.error('Error fetching festivals:', error));
  editModal.appendChild(editModalContent);
  document.body.appendChild(editModal);
}


loadOrganizers();
  
function showDeleteConfirmationOrganizer(organizerId) {
  var confirmationModal = document.getElementById('deleteConfirmationModal-organizer');
  confirmationModal.style.display = 'block';
  confirmationModal.setAttribute('data-organizer-id',organizerId);
}

function hideDeleteConfirmationOrganizer() {
  document.getElementById('deleteConfirmationModal-organizer').style.display = 'none';
}
  
function deleteOrganizer() {
  var organizerId = document.getElementById('deleteConfirmationModal-organizer').getAttribute('data-organizer-id');
  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      alert('Uspešno ste obrisali organizatora festivala!');
      location.reload();
    } else {
      throw new Error('Neuspelo brisanje organizatora. Molimo pokušajte ponovo.');
    }
  })
  .catch(error => {
    alert('Došlo je do greške pri brisanju: ' + error.message);
    console.error('Error deleting organizer:', error);
  });
  hideDeleteConfirmationOrganizer();
}


function showEditOrganizerDialog(organizerId) {
  document.getElementById(`EditDialog-organizer-${organizerId}`).style.display = 'block';
}

function hideEditOrganizerDialog(organizerId) {
  document.getElementById(`EditDialog-organizer-${organizerId}`).style.display = 'none';
}


function editOrganizer(organizerId) {
  var updatedOrganizerData = {
    naziv: document.getElementById(`edit-name-${organizerId}`).value,
    adresa: document.getElementById(`edit-address-${organizerId}`).value,
    godinaOsnivanja: document.getElementById(`edit-year-${organizerId}`).value,
    logo: document.getElementById(`edit-logo-${organizerId}`).value,
    kontaktTelefon: document.getElementById(`edit-phone-${organizerId}`).value,
    email: document.getElementById(`edit-email-${organizerId}`).value,
  
  };

  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedOrganizerData)
  })
  .then(response => {
    if (response.ok) {
      alert('Uspešno ste izmenili podatke organizatora festivala!');
      location.reload();
    } else {
      throw new Error('Neuspela izmena podataka organizatora. Molimo pokušajte ponovo.');
    }
  })
  .catch(error => {
    alert('Došlo je do greške pri izmeni podataka: ' + error.message);
    console.error('Error editing organizer:', error);
  });
}

function hideNewFestivalDialog() {
  document.getElementById('newFestivalModal').style.display = 'none';
}

function showNewFestivalDialog(organizerFestivalKey, organizerId) {
  hideEditOrganizerDialog(organizerId)
  var confirmationModal = document.getElementById('newFestivalModal');
  confirmationModal.style.display = 'block';
  confirmationModal.setAttribute('data-organizer-id',organizerFestivalKey);
}

function newFestival(){
  var organizerId = document.getElementById('deleteConfirmationModal-organizer').getAttribute('data-organizer-id');
  var festivalData = {
    naziv: document.getElementById('naziv').value,
    opis: document.getElementById('opis').value,
    fotografije: document.getElementById('fotografije').value,
    tip: document.getElementById('tip').value,
    prevoz: document.getElementById('prevoz').value,
    cena: document.getElementById('cena').value,
    maxosoba: document.getElementById('maxOsoba').value,

  };

}


function deleteFestival(organizerFestivalKey, festivalKey) {
  console.log("usli smo u fju brisanja...");
  console.log(organizerFestivalKey);
  console.log(festivalKey);
  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${organizerFestivalKey}/${festivalKey}.json`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      alert('Uspešno ste obrisali festival!');
      location.reload();
    } else {
      throw new Error('Neuspelo brisanje festival. Molimo pokušajte ponovo.');
    }
  })
  .catch(error => {
    alert('Došlo je do greške pri brisanju: ' + error.message);
    console.error('Error deleting organizer:', error);
  });
}