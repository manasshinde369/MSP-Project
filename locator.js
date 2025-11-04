// Recycling Centers Locator functionality

const Locator = {
    // Mock data for recycling centers
    centers: [
        {
            id: 'center-1',
            name: 'TechRecycle Solutions',
            address: '123 Green Street, Downtown, NY 10001',
            phone: '(555) 123-4567',
            email: 'info@techrecycle.com',
            website: 'www.techrecycle.com',
            hours: {
                weekdays: '8AM-6PM',
                saturday: '9AM-4PM',
                sunday: 'Closed'
            },
            services: ['Smartphones', 'Computers', 'Appliances', 'Batteries'],
            specialServices: ['Pickup Available', 'Data Destruction', 'Certified R2/e-Stewards'],
            rating: 4.8,
            reviews: 127,
            coordinates: { lat: 40.7128, lng: -74.0060 },
            distance: 2.3,
            certified: true,
            pickup: true,
            acceptedDevices: ['smartphones', 'computers', 'appliances', 'batteries'],
            pricing: {
                pickup: 'Free for orders over $50',
                dropoff: 'Free',
                dataDestruction: '$25 per device'
            }
        },
        {
            id: 'center-2',
            name: 'EcoRecover Center',
            address: '456 Recycle Avenue, Midtown, NY 10002',
            phone: '(555) 987-6543',
            email: 'contact@ecorecover.com',
            website: 'www.ecorecover.com',
            hours: {
                weekdays: '9AM-5PM',
                saturday: '9AM-5PM',
                sunday: 'Closed'
            },
            services: ['Computers', 'TVs', 'Gaming Consoles'],
            specialServices: ['EPA Certified', 'Bulk Processing'],
            rating: 4.2,
            reviews: 89,
            coordinates: { lat: 40.7589, lng: -73.9851 },
            distance: 4.7,
            certified: true,
            pickup: false,
            acceptedDevices: ['computers', 'tvs', 'gaming'],
            pricing: {
                pickup: 'Not available',
                dropoff: 'Free',
                dataDestruction: 'Not available'
            }
        },
        {
            id: 'center-3',
            name: 'Green Electronics Hub',
            address: '789 Sustainability Blvd, Uptown, NY 10003',
            phone: '(555) 456-7890',
            email: 'hello@greenelectronics.com',
            website: 'www.greenelectronics.com',
            hours: {
                weekdays: '7AM-7PM',
                saturday: '7AM-7PM',
                sunday: '10AM-5PM'
            },
            services: ['All Electronic Devices', 'Refurbishment', 'Parts Recovery'],
            specialServices: ['Refurbishment Services', 'R2 Certified', 'Educational Tours'],
            rating: 4.9,
            reviews: 203,
            coordinates: { lat: 40.7831, lng: -73.9712 },
            distance: 6.1,
            certified: true,
            pickup: true,
            acceptedDevices: ['all'],
            pricing: {
                pickup: '$15 flat rate',
                dropoff: 'Free',
                dataDestruction: '$20 per device',
                refurbishment: 'Quote on request'
            }
        },
        {
            id: 'center-4',
            name: 'Mobile Recycling Express',
            address: '321 Tech Park Drive, Brooklyn, NY 11201',
            phone: '(555) 234-5678',
            email: 'service@mobilerecycling.com',
            website: 'www.mobilerecycling.com',
            hours: {
                weekdays: '8AM-6PM',
                saturday: '9AM-3PM',
                sunday: 'Closed'
            },
            services: ['Smartphones', 'Tablets', 'Wearables', 'Accessories'],
            specialServices: ['Mobile Collection Service', 'Trade-in Programs', 'Corporate Partnerships'],
            rating: 4.6,
            reviews: 156,
            coordinates: { lat: 40.6892, lng: -73.9442 },
            distance: 8.2,
            certified: true,
            pickup: true,
            acceptedDevices: ['smartphones', 'tablets', 'wearables'],
            pricing: {
                pickup: 'Free for 10+ devices',
                dropoff: 'Free',
                tradein: 'Market value assessment'
            }
        },
        {
            id: 'center-5',
            name: 'Appliance Recycling Co.',
            address: '654 Industrial Way, Queens, NY 11101',
            phone: '(555) 345-6789',
            email: 'info@appliancerecycling.com',
            website: 'www.appliancerecycling.com',
            hours: {
                weekdays: '7AM-5PM',
                saturday: '8AM-2PM',
                sunday: 'Closed'
            },
            services: ['Large Appliances', 'HVAC Systems', 'Commercial Equipment'],
            specialServices: ['Heavy Equipment Removal', 'Refrigerant Recovery', 'Metal Recovery'],
            rating: 4.4,
            reviews: 78,
            coordinates: { lat: 40.7282, lng: -73.9942 },
            distance: 5.8,
            certified: true,
            pickup: true,
            acceptedDevices: ['appliances'],
            pricing: {
                pickup: '$50-150 depending on size',
                dropoff: '$25 per large appliance',
                refrigerant: 'Included in service'
            }
        }
    ],

    currentFilters: {
        distance: 10,
        deviceType: 'all',
        serviceType: 'all'
    },

    userLocation: null,

    // Initialize locator functionality
    init: function() {
        this.setupEventListeners();
        this.loadCenters();
        this.requestLocation();
    },

    // Set up event listeners
    setupEventListeners: function() {
        const searchButton = document.querySelector('.search-bar button');
        const locationInput = document.getElementById('locationSearch');
        const distanceFilter = document.getElementById('distanceFilter');
        const deviceFilter = document.getElementById('deviceFilter');
        const serviceFilter = document.getElementById('serviceFilter');

        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchLocation());
        }

        if (locationInput) {
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchLocation();
                }
            });
        }

        if (distanceFilter) {
            distanceFilter.addEventListener('change', (e) => {
                this.currentFilters.distance = parseInt(e.target.value);
                this.filterCenters();
            });
        }

        if (deviceFilter) {
            deviceFilter.addEventListener('change', (e) => {
                this.currentFilters.deviceType = e.target.value;
                this.filterCenters();
            });
        }

        if (serviceFilter) {
            serviceFilter.addEventListener('change', (e) => {
                this.currentFilters.serviceType = e.target.value;
                this.filterCenters();
            });
        }
    },

    // Request user's location
    requestLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateDistances();
                    EcoTech.Utils.showNotification('Location detected successfully', 'success');
                },
                (error) => {
                    console.log('Location access denied:', error);
                    EcoTech.Utils.showNotification('Location access denied. Using default location.', 'warning');
                }
            );
        }
    },

    // Search for location
    searchLocation: function() {
        const locationInput = document.getElementById('locationSearch');
        const query = locationInput.value.trim();

        if (!query) {
            EcoTech.Utils.showNotification('Please enter a location', 'warning');
            return;
        }

        // Simulate geocoding (in real app, use Google Maps API or similar)
        this.simulateGeocoding(query);
    },

    // Simulate geocoding service
    simulateGeocoding: function(query) {
        // Show loading state
        const searchButton = document.querySelector('.search-bar button');
        const originalText = searchButton.textContent;
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;

        setTimeout(() => {
            // Mock coordinates for common locations
            const mockLocations = {
                'new york': { lat: 40.7128, lng: -74.0060 },
                'brooklyn': { lat: 40.6782, lng: -73.9442 },
                'manhattan': { lat: 40.7831, lng: -73.9712 },
                'queens': { lat: 40.7282, lng: -73.7949 },
                'bronx': { lat: 40.8448, lng: -73.8648 }
            };

            const normalizedQuery = query.toLowerCase();
            let found = false;

            for (const [location, coords] of Object.entries(mockLocations)) {
                if (normalizedQuery.includes(location)) {
                    this.userLocation = coords;
                    this.updateDistances();
                    found = true;
                    break;
                }
            }

            if (!found) {
                // Use default NYC coordinates
                this.userLocation = { lat: 40.7128, lng: -74.0060 };
                this.updateDistances();
            }

            searchButton.textContent = originalText;
            searchButton.disabled = false;
            
            EcoTech.Utils.showNotification(`Found recycling centers near ${query}`, 'success');
        }, 1500);
    },

    // Update distances based on user location
    updateDistances: function() {
        if (!this.userLocation) return;

        this.centers.forEach(center => {
            center.distance = this.calculateDistance(
                this.userLocation.lat,
                this.userLocation.lng,
                center.coordinates.lat,
                center.coordinates.lng
            );
        });

        // Sort by distance
        this.centers.sort((a, b) => a.distance - b.distance);
        
        // Re-render centers
        this.renderCenters();
    },

    // Calculate distance between two points
    calculateDistance: function(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    // Convert degrees to radians
    toRadians: function(degrees) {
        return degrees * (Math.PI / 180);
    },

    // Load and display centers
    loadCenters: function() {
        this.renderCenters();
    },

    // Filter centers based on current filters
    filterCenters: function() {
        let filteredCenters = this.centers.filter(center => {
            // Distance filter
            if (center.distance > this.currentFilters.distance) {
                return false;
            }

            // Device type filter
            if (this.currentFilters.deviceType !== 'all') {
                if (!center.acceptedDevices.includes(this.currentFilters.deviceType) && 
                    !center.acceptedDevices.includes('all')) {
                    return false;
                }
            }

            // Service type filter
            if (this.currentFilters.serviceType !== 'all') {
                switch (this.currentFilters.serviceType) {
                    case 'pickup':
                        if (!center.pickup) return false;
                        break;
                    case 'dropoff':
                        // All centers accept drop-off
                        break;
                    case 'refurbish':
                        if (!center.services.some(s => s.toLowerCase().includes('refurbish'))) {
                            return false;
                        }
                        break;
                    case 'certified':
                        if (!center.certified) return false;
                        break;
                }
            }

            return true;
        });

        this.renderCenters(filteredCenters);
    },

    // Render centers list
    renderCenters: function(centersToRender = null) {
        const centersList = document.querySelector('.centers-list');
        if (!centersList) return;

        const centers = centersToRender || this.centers;
        
        // Clear existing content except title
        const title = centersList.querySelector('h3');
        centersList.innerHTML = '';
        if (title) {
            centersList.appendChild(title);
        } else {
            centersList.innerHTML = '<h3>Nearby Recycling Centers</h3>';
        }

        if (centers.length === 0) {
            centersList.innerHTML += `
                <div class="no-results" style="text-align: center; padding: var(--spacing-xl); color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md);"></i>
                    <p>No recycling centers found matching your criteria.</p>
                    <p>Try adjusting your filters or search area.</p>
                </div>
            `;
            return;
        }

        centers.forEach(center => {
            const centerCard = this.createCenterCard(center);
            centersList.appendChild(centerCard);
        });
    },

    // Create center card element
    createCenterCard: function(center) {
        const card = document.createElement('div');
        card.className = 'center-card';
        card.innerHTML = `
            <div class="center-header">
                <h4>${center.name}</h4>
                <div class="center-rating">
                    <span class="stars">${this.generateStars(center.rating)}</span>
                    <span class="rating-text">${center.rating} (${center.reviews} reviews)</span>
                </div>
            </div>
            <div class="center-details">
                <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
                <p><i class="fas fa-phone"></i> ${center.phone}</p>
                <p><i class="fas fa-clock"></i> Mon-Fri: ${center.hours.weekdays}, Sat: ${center.hours.saturday}</p>
                <p><i class="fas fa-${center.pickup ? 'truck' : 'store'}"></i> 
                   ${center.pickup ? 'Pickup available' : 'Drop-off only'}${center.certified ? ', Certified' : ''}
                </p>
                ${center.distance ? `<p><i class="fas fa-route"></i> ${center.distance.toFixed(1)} miles away</p>` : ''}
            </div>
            <div class="center-services">
                ${center.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
            </div>
            <div class="center-actions">
                <button class="btn btn-outline" onclick="Locator.getDirections('${center.id}')">Get Directions</button>
                <button class="btn btn-primary" onclick="Locator.showCenterDetails('${center.id}')">${center.pickup ? 'Schedule Pickup' : 'View Details'}</button>
            </div>
        `;

        return card;
    },

    // Generate star rating HTML
    generateStars: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (hasHalfStar) {
            stars += '☆';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }

        return stars;
    },

    // Get directions to center
    getDirections: function(centerId) {
        const center = this.centers.find(c => c.id === centerId);
        if (!center) return;

        // In a real app, integrate with Google Maps or Apple Maps
        const address = encodeURIComponent(center.address);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
        
        window.open(mapsUrl, '_blank');
        
        EcoTech.Utils.showNotification(`Opening directions to ${center.name}`, 'info');
    },

    // Show center details modal
    showCenterDetails: function(centerId) {
        const center = this.centers.find(c => c.id === centerId);
        if (!center) return;

        this.createDetailsModal(center);
    },

    // Create details modal
    createDetailsModal: function(center) {
        // Remove existing modal
        const existingModal = document.getElementById('centerDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'centerDetailsModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${center.name}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: var(--spacing-lg);">
                    <div class="center-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Contact Information</h4>
                            <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
                            <p><i class="fas fa-phone"></i> ${center.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${center.email}</p>
                            <p><i class="fas fa-globe"></i> <a href="http://${center.website}" target="_blank">${center.website}</a></p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Hours of Operation</h4>
                            <p><strong>Monday - Friday:</strong> ${center.hours.weekdays}</p>
                            <p><strong>Saturday:</strong> ${center.hours.saturday}</p>
                            <p><strong>Sunday:</strong> ${center.hours.sunday}</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: var(--spacing-lg);">
                        <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Services Offered</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                            ${center.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                            ${center.specialServices.map(service => `<span class="service-tag" style="background: var(--secondary-color);">${service}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: var(--spacing-lg);">
                        <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Pricing</h4>
                        <div style="background: var(--gray-50); padding: var(--spacing-md); border-radius: var(--radius-md);">
                            <p><strong>Drop-off:</strong> ${center.pricing.dropoff}</p>
                            <p><strong>Pickup:</strong> ${center.pricing.pickup}</p>
                            ${center.pricing.dataDestruction ? `<p><strong>Data Destruction:</strong> ${center.pricing.dataDestruction}</p>` : ''}
                            ${center.pricing.tradein ? `<p><strong>Trade-in:</strong> ${center.pricing.tradein}</p>` : ''}
                            ${center.pricing.refurbishment ? `<p><strong>Refurbishment:</strong> ${center.pricing.refurbishment}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="modal-actions" style="display: flex; gap: var(--spacing-sm); justify-content: flex-end;">
                        <button class="btn btn-outline" onclick="Locator.getDirections('${center.id}')">Get Directions</button>
                        ${center.pickup ? `<button class="btn btn-primary" onclick="Locator.schedulePickup('${center.id}')">Schedule Pickup</button>` : ''}
                        <button class="btn btn-primary" onclick="window.open('tel:${center.phone}')">Call Now</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Schedule pickup
    schedulePickup: function(centerId) {
        const center = this.centers.find(c => c.id === centerId);
        if (!center) return;

        // Close details modal
        const modal = document.getElementById('centerDetailsModal');
        if (modal) modal.remove();

        // In a real app, this would open a pickup scheduling form
        EcoTech.Utils.showNotification(`Pickup scheduling for ${center.name} would open here`, 'info');
        
        // Simulate scheduling
        setTimeout(() => {
            EcoTech.Utils.showNotification('Pickup scheduled successfully! You will receive a confirmation email.', 'success');
        }, 1000);
    }
};

// Initialize locator when page loads
function initializeLocator() {
    Locator.init();
}

// Make searchLocation function globally available
window.searchLocation = function() {
    Locator.searchLocation();
};

// Export locator functionality
window.Locator = Locator;

console.log('Recycling Centers Locator initialized');