document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const profileSection = document.getElementById('profileSection');
    const logoutButton = document.getElementById('logoutButton');

    // Fetch and display user profile
    async function fetchProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to log in first');
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                displayProfile(profileData);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch profile:', errorData); // Debugging line
                alert('Failed to fetch profile: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to fetch profile');
        }
    }

    // Function to display user profile
    function displayProfile(profileData) {
        profileSection.innerHTML = `
            <h2>Profile</h2>
            <p>Name: ${profileData.name}</p>
            <p>Email: ${profileData.email}</p>
            <p>Joined: ${new Date(profileData.createdAt).toLocaleDateString()}</p>
        `;
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Initial load
    fetchProfile();
});
