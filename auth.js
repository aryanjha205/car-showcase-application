document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    // Handle login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            console.log('Login data:', loginData); // Debugging line

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                console.log('Response status:', response.status); // Debugging line

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token); // Store token
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData); // Debugging line
                    alert('Login failed: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Login failed');
            }
        });
    }

    // Handle signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const signupData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });

                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    throw new Error('Signup failed');
                }
            } catch (error) {
                console.error('Error signing up:', error);
                alert('Signup failed');
            }
        });
    }

    // Handle profile display
    const profileButton = document.getElementById('profileButton'); // Add this in HTML
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
});

// Function to check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Function to display user profile
function displayProfile(profileData) {
    const profileSection = document.getElementById('profileSection'); // Add this in HTML
    profileSection.innerHTML = `
        <h2>Profile</h2>
        <p>Name: ${profileData.name}</p>
        <p>Email: ${profileData.email}</p>
        <p>Joined: ${new Date(profileData.createdAt).toLocaleDateString()}</p>
    `;
}
