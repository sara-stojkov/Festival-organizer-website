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

  // Initialize Firebase
//   const app = initializeApp(firebaseConfig);


//   var korisniciRef = firebase.database().ref("korisnici");

//         // Load the data once
//         korisniciRef.once("value")
//             .then(function(snapshot) {
//                 // Get the data as an object
//                 var korisniciData = snapshot.val();
//                 for (var key in korisniciData) {
//                     if (korisniciData.hasOwnProperty(key)) {
//                         // Create a new row element
//                         console.log("User key:", key);
//                         console.log("User data:", korisniciData[key]);
//                         const newRow = document.createElement('tr');

//                         // Access individual user data using korisniciData[key]
//                         const userData = korisniciData[key];

//                         // Iterate through the key-value pairs in the current user data
//                         for (var prop in userData) {
//                             if (userData.hasOwnProperty(prop)) {
//                                 // Create a new table cell element
//                                 const newCell = document.createElement('td');

//                                 // Set the text content of the table cell to the value of the current key-value pair
//                                 newCell.textContent = userData[prop];

//                                 // Append the table cell to the new row
//                                 newRow.appendChild(newCell);
//                             }
//                         }

//                         // Append the new row to the #all-users table
//                         allUsersTable.appendChild(newRow);
//                             }
//                         }
//                     }
        
//             .catch(function(error) {
//                 console.error("Error loading data:", error);
//             }));


function showDeleteConfirmation() {
    document.getElementById('deleteConfirmationModal').style.display = 'block';
    }

    function hideDeleteConfirmation() {
    document.getElementById('deleteConfirmationModal').style.display = 'none';
    }

function showDeleteConfirmationUser() {
    document.getElementById('deleteConfirmationModal-user').style.display = 'block';
    }

function hideDeleteConfirmationUser() {
    document.getElementById('deleteConfirmationModal-user').style.display = 'none';
    }


function showEditDialog1() {
    document.getElementById('edituser1').style.display = 'block';
    }

function hideEditDialog1() {
    document.getElementById('edituser1').style.display = 'none';
    }

function showEditDialog2() {
    document.getElementById('edituser2').style.display = 'block';
    }

function hideEditDialog2() {
    document.getElementById('edituser2').style.display = 'none';
    }

function showEditDialog3() {
    document.getElementById('edituser3').style.display = 'block';
    }

function hideEditDialog3() {
    document.getElementById('edituser3').style.display = 'none';
    }

function showEditDialog11() {
    document.getElementById('editorganizer1').style.display = 'block';
    }

    function hideEditDialog11() {
    document.getElementById('editorganizer1').style.display = 'none';
    }

function showEditDialog12() {
    document.getElementById('editorganizer2').style.display = 'block';
    }

    function hideEditDialog12() {
    document.getElementById('editorganizer2').style.display = 'none';
    }
