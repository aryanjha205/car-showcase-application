document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const adForm = document.getElementById('adForm');
    const adSelect = document.getElementById('adSelect');
    const deleteButton = document.getElementById('deleteAd');
    const adDisplay = document.getElementById('adDisplay');
    let ads = [];
    let currentAdIndex = 0;

    async function fetchAds() {
        try {
            const response = await fetch(`${API_URL}/ads`);
            ads = await response.json();
            adSelect.innerHTML = ads.map(ad => `<option value="${ad._id}">${ad.text}</option>`).join('');
            if (ads.length > 0) {
                loadAdData(ads[0]._id);
                displayAds();
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    }

    async function loadAdData(adId) {
        try {
            const response = await fetch(`${API_URL}/ads/${adId}`);
            const ad = await response.json();
            document.getElementById('logoUrl').value = ad.logoUrl;
            document.getElementById('text').value = ad.text;
            document.getElementById('redirectUrl').value = ad.redirectUrl;
        } catch (error) {
            console.error('Error loading ad data:', error);
        }
    }

    function displayAds() {
        if (ads.length === 0) return;
        adDisplay.innerHTML = `
            <div class="ad">
                <img src="${ads[currentAdIndex].logoUrl}" alt="Ad Logo">
                <p>${ads[currentAdIndex].text}</p>
                <a href="${ads[currentAdIndex].redirectUrl}" target="_blank">Learn More</a>
            </div>
        `;
        currentAdIndex = (currentAdIndex + 1) % ads.length;
        setTimeout(displayAds, 5000); // Change ad every 5 seconds
    }

    adSelect.addEventListener('change', () => {
        loadAdData(adSelect.value);
    });

    adForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(adForm);
        const adData = {
            logoUrl: formData.get('logoUrl'),
            text: formData.get('text'),
            redirectUrl: formData.get('redirectUrl')
        };

        try {
            const response = await fetch(`${API_URL}/ads`, {
                method: 'POST', // Changed to POST to add new ad
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adData),
            });

            if (response.ok) {
                alert('Ad added successfully');
                fetchAds();
            } else {
                throw new Error('Failed to add ad');
            }
        } catch (error) {
            console.error('Error adding ad:', error);
            alert('Failed to add ad');
        }
    });

    deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this ad?')) {
            try {
                const response = await fetch(`${API_URL}/ads/${adSelect.value}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Ad deleted successfully');
                    fetchAds();
                } else {
                    throw new Error('Failed to delete ad');
                }
            } catch (error) {
                console.error('Error deleting ad:', error);
                alert('Failed to delete ad');
            }
        }
    });

    fetchAds();
});
