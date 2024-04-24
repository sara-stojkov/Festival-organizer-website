function loadUsers() {
    fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json')
    .then(response => response.json())
    .then(data => {
        if (data) {
            Object.keys(data).forEach(userId => {
                const userData = data[userId];
                const newRow = createUserRow(userId, userData);
                document.getElementById('all-users').appendChild(newRow);
                createEditModal(userId, userData);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }
  
function createUserRow(userId, userData) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${userData.ime}</td>
        <td>${userData.prezime}</td>
        <td>${userData.korisnickoIme}</td>
        <td>${userData.email}</td>
        <td>${userData.datumRodjenja}</td>
        <td>${userData.adresa}</td>
        <td>${userData.telefon}</td>
        <td>${userData.zanimanje}</td>
        <td><button type="button" class="edit-btn" onclick="showEditUserDialog('${userId}')">Izmeni</button></td> 
        <td><button type="button" class="del-btn" onclick="showDeleteConfirmationUser('${userId}')">Obriši</button></td>
    `;
    return newRow;
}
  
  function createEditModal(userId, userData) {
    const editModal = document.createElement('div');
    editModal.classList.add('modal');
    editModal.classList.add('edit-user-modal');
    const editModalContent = document.createElement('div');
    editModalContent.classList.add('modal-content');
    editModalContent.classList.add('edit-user-content'); 
    editModal.id = `EditDialog-user-${userId}`;
    editModal.style.display = 'none';
    editModalContent.innerHTML = `
        <span class="close" onclick="hideEditUserDialog('${userId}')">&times;</span>
        <h2>Izmena korisnika</h2>
        <div class="col">
          <label for="name">Ime:</label>
          <input type="text" id='edit-name-${userId}' name="name" value="${userData.ime || ''}"><br>
          <label for="lastname">Prezime:</label>
          <input type="text" id='edit-lastname-${userId}' name="lastname" value="${userData.prezime || ''}"><br>
          <label for="username">Korisničko ime:</label>
          <input type="text" id='edit-username-${userId}' name="username" value="${userData.korisnickoIme || ''}"><br>
          <label for="password">Lozinka:</label>
          <input type="text" id='edit-password-${userId}' name="password" value="${userData.lozinka || ''}"><br>
          <label for="email">Email:</label>
          <input type="email" id='edit-email-${userId}' name="email" value="${userData.email || ''}"><br>
          <label for="birthdate">Datum rođenja:</label>
          <input type="date" id='edit-birthdate-${userId}' name="birthdate" value="${userData.datumRodjenja || ''}"><br>
          <label for="adress">Adresa:</label>
          <input type="text" id='edit-address-${userId}' name="adress" value="${userData.adresa || ''}"><br>
          <label for="phone">Telefon:</label>
          <input type="tel" id='edit-phone-${userId}' name="phone" value="${userData.telefon || ''}"><br>
          <label for="occupation">Zanimanje:</label>
          <input type="text" id='edit-occupation-${userId}' name="occupation" value="${userData.zanimanje || ''}"><br>
          <button type="button" class="confirmbtn" onclick="editUser('${userId}')" style="align-self: center;">Izmeni</button>
          <button type="button" class="cancelbtn" onclick="hideEditUserDialog('${userId}')">Otkaži</button>
        </div>
    `;
    editModal.appendChild(editModalContent);
    document.body.appendChild(editModal);
  }
  

function showEditUserDialog(userId) {
    document.getElementById(`EditDialog-user-${userId}`).style.display = 'block';
}

function hideEditUserDialog(userId) {
    document.getElementById(`EditDialog-user-${userId}`).style.display = 'none';
}
  
  loadUsers();
  
  
    
    
function showDeleteConfirmationUser(userId) {
var confirmationModal = document.getElementById('deleteConfirmationModal-user');
confirmationModal.style.display = 'block';
confirmationModal.setAttribute('data-user-id', userId);
}

function hideDeleteConfirmationUser() {
document.getElementById('deleteConfirmationModal-user').style.display = 'none';
}

function deleteUser() {
var userId = document.getElementById('deleteConfirmationModal-user').getAttribute('data-user-id');
fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/korisnici/${userId}.json`, {
    method: 'DELETE'
})
.then(response => {
    if (response.ok) {
    alert('Uspešno ste obrisali korisnika!');
    location.reload();
    } else {
    throw new Error('Neuspelo brisanje korisnika. Molimo pokušajte ponovo.');
    }
})
.catch(error => {
    alert('Došlo je do greške pri brisanju: ' + error.message);
    console.error('Error deleting user:', error);
});
hideDeleteConfirmationUser();
}
    
function editUser(userId) {
    var updatedUserData = {
        ime: document.getElementById(`edit-name-${userId}`).value,
        prezime: document.getElementById(`edit-lastname-${userId}`).value,
        korisnickoIme: document.getElementById(`edit-username-${userId}`).value,
        lozinka: document.getElementById(`edit-password-${userId}`).value,
        email: document.getElementById(`edit-email-${userId}`).value,
        datumRodjenja: document.getElementById(`edit-birthdate-${userId}`).value,
        adresa: document.getElementById(`edit-address-${userId}`).value,
        telefon: document.getElementById(`edit-phone-${userId}`).value,
        zanimanje: document.getElementById(`edit-occupation-${userId}`).value
    };

    fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/korisnici/${userId}.json`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUserData)
    })
    .then(response => {
    if (response.ok) {
        alert('Uspešno ste izmenili podatke korisnika!');
        location.reload();
    } else {
        throw new Error('Neuspela izmena podataka korisnika. Molimo pokušajte ponovo.');
    }
    })
    .catch(error => {
    alert('Došlo je do greške pri izmeni podataka: ' + error.message);
    console.error('Error editing user:', error);
    });
}