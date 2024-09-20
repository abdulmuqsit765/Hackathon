
import { auth, database } from './firebaseConfig.js';
import { ref, set, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Function to edit student profile
document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cnicEdit = document.getElementById('cnicEdit').value.trim();
    const user = auth.currentUser;

    if (user) {
        try {
            // Update student CNIC in Realtime Database
            await set(ref(database, 'students/' + user.uid), {
                cnic: cnicEdit,
                email: user.email // Store email too if needed
            });
            document.getElementById('editProfileMessage').textContent = 'Profile updated successfully!';
        } catch (error) {
            document.getElementById('editProfileMessage').textContent = 'Error updating profile: ' + error.message;
        }
    } else {
        document.getElementById('editProfileMessage').textContent = 'User not authenticated.';
    }
});

// Function to check results based on CNIC
document.getElementById('checkResultForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkCNIC = document.getElementById('checkCNIC').value.trim();

    // Fetch results based on CNIC
    const marksRef = ref(database, 'marks/' + checkCNIC);
    get(marksRef).then((snapshot) => {
        const data = snapshot.val();
        let html = '<h3>Results:</h3><ul>';
        if (data) {
            for (let course in data) {
                html += `<li>${course}: ${data[course].marks}/${data[course].totalMarks} - Grade: ${data[course].grade}</li>`;
            }
        } else {
            html += '<li>No results available for this CNIC.</li>';
        }
        html += '</ul>';
        document.getElementById('resultDetails').innerHTML = html;
    }).catch((error) => {
        document.getElementById('resultMessage').textContent = 'Error fetching results: ' + error.message;
    });
});
