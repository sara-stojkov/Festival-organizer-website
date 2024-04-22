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


// Function to parse URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to escape special characters in a string for use in a regular expression
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Function to highlight search text in the page text
function highlightSearchQuery(searchText) {
  var pageText = document.body.innerText;
  var regex = new RegExp(escapeRegExp(searchText), "gi");
  var highlightedText = pageText.replace(regex, function(match) {
    return "<span style='color: yellow;'>" + match + "</span>";
  });
  document.body.innerHTML = highlightedText;
}

document.getElementById("searchbtn").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission and page refresh
  var searchText = document.getElementById("searchbar").value;
  highlightSearchQuery(searchText);
});

// Get search query from URL parameter and apply highlighting
window.onload = function() {
  var searchQuery = getUrlParameter('q');
  if (searchQuery) {
      document.getElementById("searchbar").value = searchQuery;
      highlightSearchQuery(searchQuery);
  }
}

// Event listener for form submission
document.getElementById("searchForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  var searchText = document.getElementById("searchbar").value;
  var searchUrl = window.location.href.split('?')[0] + '?q=' + encodeURIComponent(searchText);
  window.location.href = searchUrl; // Redirect to URL with search query parameter
});

document.getElementById("searchbar").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission and page refresh
      var searchText = document.getElementById("searchbar").value;
      highlightSearchQuery(searchText);
  }
});


// Function to add classes based on screen width
function addClassesBasedOnScreenWidth() {
  // Get the screen width
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // Check if the screen width is below a certain threshold
  if (screenWidth <= 768) { // Adjust this threshold as needed
    // Add classes to the elements with ids firstItem and secondItem
    document.getElementById("logo-naziv").classList.add("row");
  } else {
    // Remove classes if not needed
    document.getElementById("logo-naziv").classList.remove("row");
  }
}

// Call the function initially to set classes based on initial screen width
addClassesBasedOnScreenWidth();

// Listen for window resize event to update classes if needed
window.addEventListener('resize', addClassesBasedOnScreenWidth);

