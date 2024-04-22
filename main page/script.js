// Your web app's Firebase configuration
//  const firebaseConfig = {
//   apiKey: "AIzaSyDIzbybru9FTtUBYQ-V9l5bboT6a9eOuDE",
//   authDomain: "hasta-la-fiesta.firebaseapp.com",
//   databaseURL: "https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "hasta-la-fiesta",
//   storageBucket: "hasta-la-fiesta.appspot.com",
//   messagingSenderId: "1098342569306",
//   appId: "1:1098342569306:web:ae62c7538d1a692203cf63"
// };

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

//var database_ref = firebase.database();

// window.onscroll = function() {
//   var header = document.getElementById("header");
//   var sticky = header.offsetTop;
  
//   if (window.scrollY > sticky) {
//     header.classList.add("sticky");
//   } else {
//     header.classList.remove("sticky");
//   }
// };

var loginModal = document.getElementById('login-modal-popup');
var registerModal = document.getElementById('register-modal-popup');

window.onclick = function(event) {
  if (event.target == loginModal || event.target == registerModal) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
  }
}

// const auth = firebase.auth();
// const database = firebase.database();

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

}

function validate_password(password) {
  if (password.length < 8) {
    alert('Password must be at least 8 characters long');
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
    alert('Email must contain @');
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
}

function searchPage() {
  // Get the search query entered by the user
  var searchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
  
  // Remove existing highlights
  var highlights = document.querySelectorAll('.highlight');
  highlights.forEach(function(element) {
      element.classList.remove('highlight');
  });
  
  // If the search query is empty, exit the function
  if (searchQuery === '') return;
  
  // Find and highlight matching text
  var elements = document.querySelectorAll('#content *');
  elements.forEach(function(element) {
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
              
              // Find the start and end of the matched word
              var startOfWord = beforeText.lastIndexOf(' ') + 1;
              var endOfWord = index + searchQuery.length;
              
              // Trim spaces before and after the matched word
              beforeText = beforeText.substring(0, startOfWord);
              afterText = afterText.trimLeft();
              
              // Trim spaces at the end of beforeText and start of afterText
              beforeText = beforeText.trimRight();
              afterText = afterText.trimLeft();
              
              // Create a new span element to wrap the matching text
              var span = document.createElement('span');
              span.classList.add('highlight');
              span.appendChild(document.createTextNode(matchedText));
              
              // Insert the highlighted text at the correct position
              if (beforeText) {
                  var beforeTextNode = document.createTextNode(beforeText);
                  node.parentNode.insertBefore(beforeTextNode, node);
              }
              node.parentNode.insertBefore(span, node);
              
              // Update the node value to continue searching for subsequent occurrences
              node.nodeValue = afterText;
              text = node.nodeValue.toLowerCase();
              index = text.indexOf(searchQuery);
          }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0) {
          for (var i = 0; i < node.childNodes.length; i++) {
              nodesToProcess.push(node.childNodes[i]);
          }
      }
  }
}



