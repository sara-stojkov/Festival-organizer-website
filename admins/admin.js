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
  const app = initializeApp(firebaseConfig);


  var korisniciRef = firebase.database().ref("korisnici");

        // Load the data once
        korisniciRef.once("value")
            .then(function(snapshot) {
                // Get the data as an object
                var korisniciData = snapshot.val();
                for (var key in korisniciData) {
                    if (korisniciData.hasOwnProperty(key)) {
                        // Create a new row element
                        console.log("User key:", key);
                        console.log("User data:", korisniciData[key]);
                        const newRow = document.createElement('tr');

                        // Access individual user data using korisniciData[key]
                        const userData = korisniciData[key];

                        // Iterate through the key-value pairs in the current user data
                        for (var prop in userData) {
                            if (userData.hasOwnProperty(prop)) {
                                // Create a new table cell element
                                const newCell = document.createElement('td');

                                // Set the text content of the table cell to the value of the current key-value pair
                                newCell.textContent = userData[prop];

                                // Append the table cell to the new row
                                newRow.appendChild(newCell);
                            }
                        }

                        // Append the new row to the #all-users table
                        allUsersTable.appendChild(newRow);
                            }
                        }
                    }
        
            .catch(function(error) {
                console.error("Error loading data:", error);
            }));
