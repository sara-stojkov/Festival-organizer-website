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
      const errorMessage = encodeURIComponent(error.message);
      window.location.href = `fetch_error.html?message=${errorMessage}`;
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
        <div class="col" style="padding-left:0;">
        <form id=editOrganizer>
          <label for="name">Naziv:</label>
          <input type="text" id="edit-name-${organizerId}" name="name" value="${organizerData.naziv || ''}" required><br>
          <label for="address">Adresa:</label>
          <input type="text" id="edit-address-${organizerId}" name="address" value="${organizerData.adresa || ''}" required><br>
          <label for="year">Godina osnivanja:</label>
          <input type="number" id="edit-year-${organizerId}" name="year" value="${organizerData.godinaOsnivanja || ''}" required><br>
          <label for="logo">Link do logoa:</label>
          <input type="text" id="edit-logo-${organizerId}" name="logo" value="${organizerData.logo || ''}" required><br>
          <label for="phone">Kontakt telefon:</label>
          <input type="tel" id="edit-phone-${organizerId}" name="phone" value="${organizerData.kontaktTelefon || ''}" required><br>
          <label for="birthdate">Email:</label>
          <input type="email" id="edit-email-${organizerId}" name="email" value="${organizerData.email || ''}" required><br>
          <button type="button" class="confirmbtn" onclick="editOrganizer('${organizerId}')" style="align-self: center;">Izmeni</button>
          <button type="button" class="cancelbtn edit-org-cancel" onclick="hideEditOrganizerDialog('${organizerId}')">Otkaži</button>
        </form>
        </div>

        <div class="col buttons" id="festivals-organizer-${organizerId}">
        </div>
        
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
    .catch(error => {
      console.error('Error fetching festivals:', error);
      const errorMessage = encodeURIComponent(error.message);
      window.location.href = `fetch_error.html?message=${errorMessage}`;});
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
    const errorMessage = encodeURIComponent(error.message);
    window.location.href = `fetch_error.html?message=${errorMessage}`;
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

  if (validate_field(updatedOrganizerData.naziv) === false || validate_field(updatedOrganizerData.adresa) === false || validate_field(updatedOrganizerData.godinaOsnivanja) === false || validate_field(updatedOrganizerData.logo) === false || validate_field(updatedOrganizerData.kontaktTelefon) === false || validate_field(updatedOrganizerData.email) === false) {
    alert('Sva polja moraju biti popunjena!');
    return;
  }

  
  if (! validate_address(updatedOrganizerData.adresa)){
    return;
  }

  if (! validate_email_format(updatedOrganizerData.email)){
    alert('Email nije u dobrom formatu!');
    return;
  }

  if (parseInt(updatedOrganizerData.godinaOsnivanja, 10) > 2024){
    alert("Nije osnovano u budućnosti. Problem sa godinom osnivanja! ")
    return;
  }

  valid_link(updatedOrganizerData.logo)
    .then(valid => {
        if (valid) {
        } else {
            alert("Link do logoa nije validan!");
            return;
        }
    });

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

function validate_field(field) {
  if (field.length < 1) {
    alert('Polje ne sme biti prazno');
    return false;
  }
  return true;
}

function validate_address(inputAddress){
  if (!inputAddress.includes(',')) {
    alert('Adresa treba da bude u formatu: ulica i broj, mesto/grad, poštanski broj');
    return false;
  }
  return true;
}

function validate_email_format(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function valid_link(url) {
  try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
  } catch (error) {
      return false;
  }
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

async function newFestival() {
  const isValid = await validateNewFestivalForm();
  
  if (isValid) { 
      const organizerId = document.getElementById('newFestivalModal').getAttribute('data-organizer-id');

      const fotografijeLinkovi = document.getElementById("fotografijenew").value;
      const nizLinkova = fotografijeLinkovi.split(",").map(link => link.trim());

      const slikeHashMap = {};
      nizLinkova.forEach((link, index) => {
          slikeHashMap[index] = link;
      });

      const festivalData = {
          naziv: document.getElementById('nazivnew').value,
          opis: document.getElementById('opisnew').value,
          tip: document.getElementById('tipnew').value,
          prevoz: document.getElementById('prevoznew').value,
          cena: document.getElementById('cenanew').value,
          maxOsoba: document.getElementById('maxOsobanew').value,
          slike: slikeHashMap
      };

      try {
          const response = await fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/festivali/${organizerId}.json`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(festivalData)
          });

          if (response.ok) {
              alert('Uspešno ste kreirali novi festival!');
              location.reload();
          } else {
              throw new Error('Neuspelo kreiranje novog festivala. Molimo pokušajte ponovo.');
          }
      } catch (error) {
          alert('Došlo je do greške pri kreiranju novog festivala: ' + error.message);
          console.error('Error creating new festival:', error);
      }
  } else {
    alert("Novi festival nije kreiran zbog nevalidnih podataka.");
  }
}




function deleteFestival(organizerFestivalKey, festivalKey) {

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

async function validateNewFestivalForm(){

  const naziv = document.getElementById("nazivnew").value.trim();
  const opis = document.getElementById("opisnew").value.trim();
  const tip = document.getElementById("tipnew").value;
  const prevoz = document.getElementById("prevoznew").value;
  const cena = document.getElementById("cenanew").value.trim();
  const maxOsoba = document.getElementById("maxOsobanew").value.trim();

  if (naziv === "" || opis === "" || tip === "" || prevoz === "" || cena === "" || maxOsoba === "") {
      alert("Sva polja moraju biti popunjena.");
      return false;
  }

  if (naziv.length < 2){
    alert("Naziv mora biti duži od 2 karaktera!")
    return false;
  }
  if (opis.length < 10){
    alert("Opis mora biti duži od 10 karaktera!")
    return false;
  }

  if (parseFloat(cena) < 0) {
    alert("Cena ne može biti negativna.");
    return false;
  }

  if (parseFloat(maxOsoba) < 0) {
    alert("Broj osoba ne može biti negativan.");
    return false;
  }

  const fotografije = document.getElementById("fotografijenew").value.trim();
  const fotografijeArray = fotografije.split(",");
  const linkValidationPromises = [];

  for (let i = 0; i < fotografijeArray.length; i++) {
      const link = fotografijeArray[i].trim();
      if (link === "") {
          alert("Unesite validne linkove fotografija razdvojene zarezom (,).");
          return false;
      }

      const linkValidationPromise = fetch(link)
          .then(response => {
              if (!response.ok) {
                  alert(`Link ${link} nije validan.`);
                  return Promise.reject(`Link ${link} nije validan.`);
              }
          })
          .catch(error => {
              alert(`Došlo je do greške prilikom provere linka ${link}: ${error.message}`);
              return false;
          });

      linkValidationPromises.push(linkValidationPromise);
  }

  const linkValidationResults = await Promise.all(linkValidationPromises);

  if (linkValidationResults.some(result => result === false)) {
      return false;
  }

  return true;
}

