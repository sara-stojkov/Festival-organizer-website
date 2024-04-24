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
        <td><button type="button" class="edit-btn" onclick="showEditUserDialog('${organizerId}')">Izmeni</button></td> 
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
        <span class="close" onclick="hideEditUserDialog('${organizerId}')">&times;</span>
        <h2>Izmena korisnika</h2>
        <div class="row">
          <div class="col">
            <label for="name">Naziv:</label>
            <input type="text" id="edit-name-${organizerId}" name="name" value="${organizerData.naziv || ''}"><br>
            <label for="lastname">Adresa:</label>
            <input type="text" id="edit-lastname-${organizerId}" name="lastname" value="${organizerData.adresa || ''}"><br>
            <label for="username">Godina osnivanja:</label>
            <input type="text" id="edit-username-${organizerId}" name="username" value="${organizerData.godinaOsnivanja || ''}"><br>
            <label for="password">Link do logoa:</label>
            <input type="text" id="edit-password-${organizerId}" name="password" value="${organizerData.logo || ''}"><br>
            <label for="email">Kontakt telefon:</label>
            <input type="email" id="edit-email-${organizerId}" name="email" value="${organizerData.kontaktTelefon || ''}"><br>
            <label for="birthdate">Email:</label>
            <input type="email" id="edit-email-${organizerId}" name="email" value="${organizerData.email || ''}"><br>
          </div>

          <div class="col" id="festivals-organizer-${organizerId}>
            
          </div>
          <button type="button" class="confirmbtn" onclick="editUser('${organizerId}')" style="align-self: center;">Izmeni</button>
          <button type="button" class="cancelbtn" onclick="hideEditUserDialog('${organizerId}')">Otkaži</button>
        </div>
    `;
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
  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFesivala/${organizerId}.json`, {
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
    console.error('Error deleting user:', error);
  });
  hideDeleteConfirmationUser();
}

function editOrganizer(organizerId) {
  var updatedUserData = {
    ime: document.getElementById('name').value,
    prezime: document.getElementById('address').value,
    korisnickoIme: document.getElementById('year').value,
    lozinka: document.getElementById('logo').value,
    email: document.getElementById('phone').value,
    datumRodjenja: document.getElementById('email').value,
  //  brisanje dodavanje festivala
  };

  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUserData)
  })
  .then(response => {
    if (response.ok) {
      alert('Uspešno ste izmenili podatke organizatora festiva;a!');
      location.reload();
    } else {
      throw new Error('Neuspela izmena podataka organizatora. Molimo pokušajte ponovo.');
    }
  })
  .catch(error => {
    alert('Došlo je do greške pri izmeni podataka: ' + error.message);
    console.error('Error editing user:', error);
  });
}

