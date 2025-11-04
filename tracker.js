// Device Lifecycle Tracker functionality

const Tracker = {
    devices: [],
    
    // Device health calculation factors
    healthFactors: {
        age: 0.4,
        condition: 0.3,
        usage: 0.2,
        maintenance: 0.1
    },

    // Initialize tracker
    init: function() {
        this.loadDevices();
        this.setupEventListeners();
        this.updateStats();
    },

    // Load devices from storage
    loadDevices: function() {
        this.devices = EcoTech.Storage.get('tracker_devices') || this.getDefaultDevices();
        this.renderDevices();
    },

    // Get default demo devices
    getDefaultDevices: function() {
        return [
            {
                id: 'device-1',
                name: 'iPhone 13 Pro',
                type: 'smartphone',
                purchaseDate: '2022-01-15',
                condition: 'excellent',
                batteryHealth: 89,
                performance: 92,
                lastMaintenance: '2024-01-10',
                usageHours: 6,
                issues: [],
                maintenanceHistory: [
                    { date: '2024-01-10', type: 'Software Update', notes: 'iOS 17.2 installed' },
                    { date: '2023-08-15', type: 'Screen Protector', notes: 'Replaced screen protector' }
                ]
            },
            {
                id: 'device-2',
                name: 'MacBook Air M1',
                type: 'laptop',
                purchaseDate: '2021-03-20',
                condition: 'good',
                batteryHealth: 76,
                performance: 88,
                lastMaintenance: '2023-12-05',
                usageHours: 8,
                issues: ['Battery degradation'],
                maintenanceHistory: [
                    { date: '2023-12-05', type: 'System Cleanup', notes: 'Cleaned storage and optimized performance' },
                    { date: '2023-06-10', type: 'Battery Calibration', notes: 'Recalibrated battery' }
                ]
            },
            {
                id: 'device-3',
                name: 'iPad Pro 11"',
                type: 'tablet',
                purchaseDate: '2020-09-10',
                condition: 'fair',
                batteryHealth: 68,
                performance: 72,
                lastMaintenance: '2023-10-20',
                usageHours: 4,
                issues: ['Screen scratches', 'Battery degradation'],
                maintenanceHistory: [
                    { date: '2023-10-20', type: 'Screen Repair', notes: 'Minor scratch repair attempted' },
                    { date: '2023-03-15', type: 'Software Update', notes: 'iPadOS 16.4 installed' }
                ]
            },
            {
                id: 'device-4',
                name: 'Samsung 55" QLED',
                type: 'tv',
                purchaseDate: '2019-11-25',
                condition: 'poor',
                batteryHealth: null,
                performance: 38,
                lastMaintenance: '2023-08-30',
                usageHours: 5,
                issues: ['Display dimming', 'Slow response', 'Audio issues'],
                maintenanceHistory: [
                    { date: '2023-08-30', type: 'Firmware Update', notes: 'Updated to latest firmware' },
                    { date: '2022-12-10', type: 'Calibration', notes: 'Display calibration performed' }
                ]
            }
        ];
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Add device button
        const addButton = document.querySelector('button[onclick="openAddDeviceModal()"]');
        if (addButton) {
            addButton.addEventListener('click', this.openAddDeviceModal.bind(this));
        }
    },

    // Calculate device age in years
    calculateAge: function(purchaseDate) {
        const purchase = new Date(purchaseDate);
        const now = new Date();
        const diffTime = Math.abs(now - purchase);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        return Math.round(diffYears * 10) / 10;
    },

    // Calculate overall device health score
    calculateHealthScore: function(device) {
        const age = this.calculateAge(device.purchaseDate);
        const maxAge = this.getMaxAge(device.type);
        
        // Age score (newer is better)
        const ageScore = Math.max(0, (maxAge - age) / maxAge * 100);
        
        // Condition score
        const conditionScores = {
            excellent: 100,
            good: 80,
            fair: 60,
            poor: 30,
            broken: 10
        };
        const conditionScore = conditionScores[device.condition] || 50;
        
        // Performance score
        const performanceScore = device.performance || 50;
        
        // Battery score (if applicable)
        const batteryScore = device.batteryHealth || performanceScore;
        
        // Calculate weighted average
        const healthScore = (
            ageScore * this.healthFactors.age +
            conditionScore * this.healthFactors.condition +
            performanceScore * this.healthFactors.usage +
            batteryScore * this.healthFactors.maintenance
        );
        
        return Math.round(healthScore);
    },

    // Get maximum expected age for device type
    getMaxAge: function(type) {
        const maxAges = {
            smartphone: 4,
            laptop: 6,
            tablet: 5,
            tv: 10,
            gaming: 8,
            appliance: 12
        };
        return maxAges[type] || 5;
    },

    // Get device icon
    getDeviceIcon: function(type) {
        const icons = {
            smartphone: 'fas fa-mobile-alt',
            laptop: 'fas fa-laptop',
            tablet: 'fas fa-tablet-alt',
            tv: 'fas fa-tv',
            gaming: 'fas fa-gamepad',
            appliance: 'fas fa-blender'
        };
        return icons[type] || 'fas fa-microchip';
    },

    // Render devices grid
    renderDevices: function() {
        const devicesGrid = document.querySelector('.devices-grid');
        if (!devicesGrid) return;

        // Clear existing devices (keep first 4 demo devices)
        const existingCards = devicesGrid.querySelectorAll('.device-card');
        existingCards.forEach((card, index) => {
            if (index >= 4) {
                card.remove();
            }
        });

        // Add new devices
        this.devices.slice(4).forEach(device => {
            const deviceCard = this.createDeviceCard(device);
            devicesGrid.appendChild(deviceCard);
        });
    },

    // Create device card element
    createDeviceCard: function(device) {
        const age = this.calculateAge(device.purchaseDate);
        const healthScore = this.calculateHealthScore(device);
        const maxAge = this.getMaxAge(device.type);
        const agePercentage = Math.min((age / maxAge) * 100, 100);

        const card = document.createElement('div');
        card.className = 'device-card';
        card.innerHTML = `
            <div class="device-header">
                <div class="device-icon">
                    <i class="${this.getDeviceIcon(device.type)}"></i>
                </div>
                <div class="device-info">
                    <h3>${device.name}</h3>
                    <p>Purchased: ${EcoTech.Utils.formatDate(device.purchaseDate)}</p>
                </div>
                <div class="device-status ${device.condition}">
                    <span>${device.condition.charAt(0).toUpperCase() + device.condition.slice(1)}</span>
                </div>
            </div>
            
            <div class="device-metrics">
                <div class="metric">
                    <label>Age</label>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${agePercentage}%"></div>
                    </div>
                    <span>${age} years</span>
                </div>
                ${device.batteryHealth ? `
                <div class="metric">
                    <label>Battery Health</label>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${device.batteryHealth}%"></div>
                    </div>
                    <span>${device.batteryHealth}%</span>
                </div>
                ` : ''}
                <div class="metric">
                    <label>Performance</label>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${device.performance}%"></div>
                    </div>
                    <span>${device.performance}%</span>
                </div>
                <div class="metric">
                    <label>Overall Health</label>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${healthScore}%"></div>
                    </div>
                    <span>${healthScore}%</span>
                </div>
            </div>
            
            <div class="device-actions">
                <button class="btn btn-outline" onclick="Tracker.showDeviceDetails('${device.id}')">View Details</button>
                <button class="btn btn-primary" onclick="Tracker.updateDeviceStatus('${device.id}')">Update Status</button>
            </div>
        `;

        return card;
    },

    // Update tracker stats
    updateStats: function() {
        const totalDevices = this.devices.length;
        const avgAge = this.devices.reduce((sum, device) => sum + this.calculateAge(device.purchaseDate), 0) / totalDevices;
        const avgHealth = this.devices.reduce((sum, device) => sum + this.calculateHealthScore(device), 0) / totalDevices;

        // Update stats display
        const statsElements = document.querySelectorAll('.tracker-stats .stat-number');
        if (statsElements.length >= 3) {
            statsElements[0].textContent = totalDevices;
            statsElements[1].textContent = avgAge.toFixed(1);
            statsElements[2].textContent = Math.round(avgHealth) + '%';
        }
    },

    // Open add device modal
    openAddDeviceModal: function() {
        const modal = document.getElementById('addDeviceModal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Close add device modal
    closeAddDeviceModal: function() {
        const modal = document.getElementById('addDeviceModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Handle add device form submission
    handleAddDevice: function(formData) {
        const newDevice = {
            id: EcoTech.Utils.generateId(),
            name: formData.get('deviceName'),
            type: formData.get('deviceTypeModal'),
            purchaseDate: formData.get('purchaseDate'),
            condition: formData.get('initialCondition'),
            batteryHealth: this.getInitialBatteryHealth(formData.get('deviceTypeModal')),
            performance: this.getInitialPerformance(formData.get('initialCondition')),
            lastMaintenance: new Date().toISOString().split('T')[0],
            usageHours: 6, // Default
            issues: [],
            maintenanceHistory: [{
                date: new Date().toISOString().split('T')[0],
                type: 'Device Added',
                notes: 'Device added to tracker'
            }]
        };

        this.devices.push(newDevice);
        this.saveDevices();
        this.renderDevices();
        this.updateStats();
        this.closeAddDeviceModal();

        EcoTech.Utils.showNotification(`${newDevice.name} added successfully!`, 'success');
    },

    // Get initial battery health based on device type
    getInitialBatteryHealth: function(type) {
        const batteryTypes = ['smartphone', 'laptop', 'tablet'];
        return batteryTypes.includes(type) ? 100 : null;
    },

    // Get initial performance based on condition
    getInitialPerformance: function(condition) {
        const performanceMap = {
            excellent: 95,
            good: 85,
            fair: 70
        };
        return performanceMap[condition] || 80;
    },

    // Show device details modal
    showDeviceDetails: function(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        this.createDeviceDetailsModal(device);
    },

    // Create device details modal
    createDeviceDetailsModal: function(device) {
        const existingModal = document.getElementById('deviceDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const age = this.calculateAge(device.purchaseDate);
        const healthScore = this.calculateHealthScore(device);
        const remainingLife = Math.max(0, this.getMaxAge(device.type) - age);

        const modal = document.createElement('div');
        modal.id = 'deviceDetailsModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>${device.name}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: var(--spacing-lg);">
                    <div class="device-overview" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                        <div>
                            <h4 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Device Information</h4>
                            <p><strong>Type:</strong> ${device.type.charAt(0).toUpperCase() + device.type.slice(1)}</p>
                            <p><strong>Purchase Date:</strong> ${EcoTech.Utils.formatDate(device.purchaseDate)}</p>
                            <p><strong>Age:</strong> ${age} years</p>
                            <p><strong>Condition:</strong> ${device.condition.charAt(0).toUpperCase() + device.condition.slice(1)}</p>
                            <p><strong>Daily Usage:</strong> ${device.usageHours} hours</p>
                        </div>
                        <div>
                            <h4 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Health Metrics</h4>
                            <p><strong>Overall Health:</strong> ${healthScore}%</p>
                            ${device.batteryHealth ? `<p><strong>Battery Health:</strong> ${device.batteryHealth}%</p>` : ''}
                            <p><strong>Performance:</strong> ${device.performance}%</p>
                            <p><strong>Estimated Remaining Life:</strong> ${remainingLife.toFixed(1)} years</p>
                            <p><strong>Last Maintenance:</strong> ${EcoTech.Utils.formatDate(device.lastMaintenance)}</p>
                        </div>
                    </div>

                    ${device.issues.length > 0 ? `
                    <div style="margin-bottom: var(--spacing-lg);">
                        <h4 style="color: var(--error-color); margin-bottom: var(--spacing-sm);">Current Issues</h4>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: var(--spacing-md); border-radius: var(--radius-md);">
                            ${device.issues.map(issue => `<p style="margin: 0; color: var(--error-color);">• ${issue}</p>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <div style="margin-bottom: var(--spacing-lg);">
                        <h4 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Maintenance History</h4>
                        <div style="max-height: 200px; overflow-y: auto;">
                            ${device.maintenanceHistory.map(entry => `
                                <div style="border-bottom: 1px solid var(--gray-200); padding: var(--spacing-sm) 0;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <strong>${entry.type}</strong>
                                        <span style="color: var(--gray-500); font-size: var(--font-size-sm);">${EcoTech.Utils.formatDate(entry.date)}</span>
                                    </div>
                                    <p style="margin: var(--spacing-xs) 0 0 0; color: var(--gray-600);">${entry.notes}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="modal-actions" style="display: flex; gap: var(--spacing-sm); justify-content: flex-end;">
                        <button class="btn btn-outline" onclick="Tracker.addMaintenanceRecord('${device.id}')">Add Maintenance</button>
                        <button class="btn btn-outline" onclick="Tracker.updateDeviceStatus('${device.id}')">Update Status</button>
                        <button class="btn btn-primary" onclick="Tracker.scheduleReminder('${device.id}')">Set Reminder</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Update device status
    updateDeviceStatus: function(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        // In a real app, this would open a status update form
        EcoTech.Utils.showNotification(`Status update for ${device.name} would open here`, 'info');
    },

    // Add maintenance record
    addMaintenanceRecord: function(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        // In a real app, this would open a maintenance form
        EcoTech.Utils.showNotification(`Maintenance record form for ${device.name} would open here`, 'info');
    },

    // Schedule reminder
    scheduleReminder: function(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        // In a real app, this would open a reminder scheduling form
        EcoTech.Utils.showNotification(`Reminder scheduled for ${device.name}`, 'success');
    },

    // Save devices to storage
    saveDevices: function() {
        EcoTech.Storage.set('tracker_devices', this.devices);
    }
};

// Initialize tracker
function initializeTracker() {
    Tracker.init();
}

// Global functions for modal handling
window.openAddDeviceModal = function() {
    Tracker.openAddDeviceModal();
};

window.closeAddDeviceModal = function() {
    Tracker.closeAddDeviceModal();
};

// Handle add device form submission
function handleAddDeviceSubmission(form) {
    const formData = new FormData(form);
    Tracker.handleAddDevice(formData);
}

// Export tracker functionality
window.Tracker = Tracker;

console.log('Device Lifecycle Tracker initialized');