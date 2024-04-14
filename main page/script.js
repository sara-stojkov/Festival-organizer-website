// Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyDIzbybru9FTtUBYQ-V9l5bboT6a9eOuDE",
  authDomain: "hasta-la-fiesta.firebaseapp.com",
  databaseURL: "https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hasta-la-fiesta",
  storageBucket: "hasta-la-fiesta.appspot.com",
  messagingSenderId: "1098342569306",
  appId: "1:1098342569306:web:ae62c7538d1a692203cf63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var database_ref = firebase.database();

window.onscroll = function() {
  var header = document.getElementById("header");
  var sticky = header.offsetTop;
  
  if (window.scrollY > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
};

var loginModal = document.getElementById('login-modal-popup');
var registerModal = document.getElementById('register-modal-popup');

window.onclick = function(event) {
  if (event.target == loginModal || event.target == registerModal) {
    loginModal.style.display = "none";
    registerModal.style.display = "none";
  }
}

const auth = firebase.auth();
const database = firebase.database();

document.getElementById("regform").addEventListener("submit", register);

function register() {
  var username = document.getElementById('registerusername').value;
  var password = document.getElementById('registerpassword').value;
  var firstName = document.getElementById('registerfirstname').value;
  var lastName = document.getElementById('registerlastname').value;
  var email = document.getElementById('registeremail').value;
  var birthdate = document.getElementById('registerbirthdate').value;
  var adress = document.getElementById('registeradress').value;
  var phoneNumber = document.getElementById('registerphonenumber').value;
  var occupation = document.getElementById('registeroccupation').value;

  if (validate_email(email) === false || validate_password(password) === false || validate_field(username) === false || validate_field(firstName) === false || validate_field(lastName) === false || validate_field(birthdate) === false || validate_field(adress) === false || validate_field(phoneNumber) === false || validate_field(occupation) === false) {
    alert('Neuspešna registracija!');
    return;
  }

  if (validate_field(username) === false || validate_field(firstName) === false || validate_field(lastName) === false || validate_field(birthdate) === false || validate_field(adress) === false || validate_field(phoneNumber) === false || validate_field(occupation) === false) {
    alert('Sva polja moraju biti popunjena!');
    return;
  }


  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      var user = auth.currentUser;

      var database_ref = database.ref();

      var user_data = {
        "korisnickoIme": username,
        "lozinka": password,
        "ime": firstName,
        "prezime": lastName,
        "email": email,
        "datumRodjenja": birthdate,
        "adresa": adress,
        "telefon": phoneNumber,
        "zanimanje": occupation
      }
      
      database_ref.child(korisnici).child(user.uid).set(user_data);

      alert('Registracija uspešna!');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
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

function login() {
  var username = document.getElementById('loginusername').value;
  var password = document.getElementById('loginpassword').value;
  console.log(username);
  if (validate_field(username) === false || validate_password(password) === false) {
    alert('Neuspešna prijava!');
    return;
  }
  database_ref.child('korisnici').once('value', function(snapshot) {
    var users = snapshot.val();
    var foundUser = false;

    for (var key in users) {
      if (users.hasOwnProperty(key)) {
        var user = users[key];
        if (user.korisnickoIme === username && user.lozinka === password) {
          foundUser = true;
          break;
        }
      }
    }

    if (foundUser) {
      alert('Uspešna prijava!');
    } else {
      alert('Neuspešna prijava!');
    }
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


