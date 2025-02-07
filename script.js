document.addEventListener('DOMContentLoaded', () => {
    const vehicleGrid = document.getElementById('vehicleGrid');
    const vehicleForm = document.getElementById('vehicleForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    const API_URL = 'http://localhost:3000/api';

    // Fetch and display vehicles
    async function fetchVehicles(searchParams = {}) {
        try {
            let url = `${API_URL}/vehicles`;
            if (Object.keys(searchParams).length > 0) {
                const params = new URLSearchParams(searchParams);
                url += `/search?${params.toString()}`;
            }
            
            const response = await fetch(url);
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            showError('Failed to load vehicles');
        }
    }

    // Display vehicles in grid
    function displayVehicles(vehicles) {
        vehicleGrid.innerHTML = '';
        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.innerHTML = `
                <img src="${vehicle.imageUrl}" alt="${vehicle.brand} ${vehicle.model}">
                <div class="vehicle-info">
                    <h2>${vehicle.brand} ${vehicle.model}</h2>
                    <p>${vehicle.description}</p>
                    <div class="specifications">
                        <h3>Specifications</h3>
                        <p>Engine: ${vehicle.specifications.engine}</p>
                        <p>Transmission: ${vehicle.specifications.transmission}</p>
                        <p>Mileage: ${vehicle.specifications.mileage}</p>
                        <p>Fuel Type: ${vehicle.specifications.fuelType}</p>
                    </div>
                    <div class="price">$${vehicle.price.toLocaleString()}</div>
                </div>
            `;
            vehicleGrid.appendChild(card);
        });
    }

    // Add new vehicle
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(vehicleForm);
        
        const vehicleData = {
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            price: parseInt(formData.get('price')),
            imageUrl: formData.get('imageUrl'),
            description: formData.get('description'),
            specifications: {
                engine: formData.get('engine'),
                transmission: formData.get('transmission'),
                mileage: formData.get('mileage'),
                fuelType: formData.get('fuelType')
            }
        };

        try {
            const response = await fetch(`${API_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });

            if (response.ok) {
                vehicleForm.reset();
                fetchVehicles();
                showSuccess('Vehicle added successfully');
            } else {
                throw new Error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            showError('Failed to add vehicle');
        }
    });

  // Search functionality
  document.addEventListener('DOMContentLoaded', () => {
    const vehicleGrid = document.getElementById('vehicleGrid');
    const vehicleForm = document.getElementById('vehicleForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const colorFilter = document.getElementById('colorFilter'); // Add this in HTML
    const sortPrice = document.getElementById('sortPrice'); // Add this in HTML

    const API_URL = 'http://localhost:3000/api';

    async function fetchVehicles(searchParams = {}) {
        try {
            let url = `${API_URL}/vehicles`;
            if (Object.keys(searchParams).length > 0) {
                const params = new URLSearchParams(searchParams);
                url += `?${params.toString()}`;  // Fixed URL formatting
            }

            const response = await fetch(url);
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            showError('Failed to load vehicles');
        }
    }

    function displayVehicles(vehicles) {
        vehicleGrid.innerHTML = '';
        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.innerHTML = `
                <img src="${vehicle.imageUrl}" alt="${vehicle.brand} ${vehicle.model}">
                <div class="vehicle-info">
                    <h2>${vehicle.brand} ${vehicle.model}</h2>
                    <p>${vehicle.description}</p>
                    <p>Color: ${vehicle.color || 'N/A'}</p>
                    <div class="specifications">
                        <h3>Specifications</h3>
                        <p>Engine: ${vehicle.specifications.engine}</p>
                        <p>Transmission: ${vehicle.specifications.transmission}</p>
                        <p>Mileage: ${vehicle.specifications.mileage}</p>
                        <p>Fuel Type: ${vehicle.specifications.fuelType}</p>
                    </div>
                    <div class="price">$${vehicle.price.toLocaleString()}</div>
                </div>
            `;
            vehicleGrid.appendChild(card);
        });
    }

    searchButton.addEventListener('click', () => {
        const searchParams = {};

        if (searchInput.value.trim()) {
            searchParams.brand = searchInput.value.trim();
        }
        if (colorFilter.value) {
            searchParams.color = colorFilter.value;
        }
        if (sortPrice.value === 'low-to-high') {
            searchParams.sort = 'price';
        }

        fetchVehicles(searchParams);
    });

    function showError(message) {
        alert(message);
    }

    fetchVehicles();
});


    // Helper functions for notifications
    function showSuccess(message) {
        alert(message); // Replace with better notification system in production
    }

    function showError(message) {
        alert(message); // Replace with better notification system in production
    }

    // Initial load
    fetchVehicles();
});