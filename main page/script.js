

var loginModal = document.getElementById('login-modal-popup');
var registerModal = document.getElementById('register-modal-popup');

window.onclick = function(event) {
  if (event.target == loginModal || event.target == registerModal) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
  }
}

document.getElementById("regform").addEventListener("submit", register);

function register(e) {
  e.preventDefault();
  var username = document.getElementById('registerusername').value;
  var password = document.getElementById('registerpassword').value;
  var firstName = document.getElementById('registerfirstname').value;
  var lastName = document.getElementById('registerlastname').value;
  var email = document.getElementById('registeremail').value;
  var birthdate = document.getElementById('registerbirthdate').value;
  var adress = document.getElementById('registeradress').value;
  var phoneNumber = document.getElementById('registerphone').value;
  var occupation = document.getElementById('registeroccupation').value;

  if (validate_email(email) === false || validate_password(password) === false || validate_field(username) === false || validate_field(firstName) === false || validate_field(lastName) === false || validate_field(birthdate) === false || validate_field(adress) === false || validate_field(phoneNumber) === false || validate_field(occupation) === false) {
    alert('Neuspešna registracija!');
    return;
  }

  if (validate_field(username) === false || validate_field(firstName) === false || validate_field(lastName) === false || validate_field(birthdate) === false || validate_field(adress) === false || validate_field(phoneNumber) === false || validate_field(occupation) === false) {
    alert('Sva polja moraju biti popunjena!');
    return;
  }

  if (! validate_email_format(email)){
    alert('Email nije u dobrom formatu!');
    return;
  }

  if (! validate_birthdate(birthdate)){
    alert('Greška sa datumom rođenja, sajt ne dozvoljava osobe mlađe od 5 godina..')
    return;
  }

  if (! validate_address(adress)){
    return;
  }

  if (! validate_phonenumber(phoneNumber)){
    alert("Broj telefona nije validan!");
    return;
  }

  fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      korisnickoIme: username,
      lozinka: password,
      ime: firstName,
      prezime: lastName,
      email: email,
      datumRodjenja: birthdate,
      adresa: adress,
      telefon: phoneNumber,
      zanimanje: occupation
    })
  }).then(resonse => resonse.json())
  .then(() => alert("Registracija uspešna!"))
  .catch(e => alert("Greška"))
  var modal = document.getElementById('register-modal-popup');
  modal.classList.add('hidden');
  document.getElementById('regform').reset();
}

function validate_password(password) {
  if (password.length < 6) {
    alert('Lozinka mora da ima bar 6 karaktera');
    return false;
  }
  return true;
}

function validate_field(field) {
  if (field.length < 1) {
    alert('Polje ne sme biti prazno');
    return false;
  }
  return true;
}

function validate_email(email) {
  if (!email.includes('@')) {
    alert('Email mora da sadrži @');
    return false;
  }
  return true;
}

function validate_email_format(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validate_birthdate(inputDate) {
  var parts = inputDate.split('/');
  var inputYear = parseInt(parts[2], 10);
  var inputMonth = parseInt(parts[1], 10) - 1; 
  var inputDay = parseInt(parts[0], 10);

  var minDate = new Date(2020, 0, 1); 

  var date = new Date(inputYear, inputMonth, inputDay);

  if (date < minDate) {
      return false; 
  } else {
      return true; 
  }
}

function validate_address(inputAddress){
  if (!inputAddress.includes(',')) {
    alert('Adresa treba da bude u formatu: ulica i broj, mesto/grad, poštanski broj');
    return false;
  }
  return true;
}

function validate_phonenumber(phoneNumber) {
  var numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (numericPhoneNumber.length !== phoneNumber.length) {
    return false;
}

  if (numericPhoneNumber.length === 0) {
      return false; 
  }

  if (numericPhoneNumber.length < 7 || numericPhoneNumber.length > 15) {
      return false;
  }

  return true;
}

document.getElementById("loginForm").addEventListener("submit", login);

function login(e) {
  e.preventDefault();
  var username = document.getElementById('loginusername').value;
  var password = document.getElementById('loginpassword').value;

  fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        for (const userKey in data) {
          if (data[userKey].korisnickoIme === username) {
            if (data[userKey].lozinka === password) {
              alert("Uspešno ste prijavljeni!");

              return; 
            } else {
              alert("Pogrešna lozinka!");
              return; 
            }
          }
        }
        alert("Korisničko ime ne postoji!");
      } else {
        alert("Nema registrovanih korisnika u sistemu!"); 
      }
    })
    .catch(error => {
      console.error('Greška:', error);
      alert("Greška prilikom prijave.");
    });
    var modal = document.getElementById('login-modal-popup');
  modal.classList.add('hidden');
  document.getElementById('loginForm').reset()
}

