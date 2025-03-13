document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const ADMIN_USERNAME = 'aryanjha205';
    const ADMIN_PASSWORD = 'jhakunar1';

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    });
});
