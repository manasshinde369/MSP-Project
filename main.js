// Main JavaScript functionality for EcoTech E-Waste Management App

// Global state management
const AppState = {
    currentPage: 'dashboard',
    user: null,
    devices: [],
    reports: [],
    recyclingCenters: []
};

// Utility functions
const Utils = {
    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Format dates
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    min-width: 300px;
                    border-left: 4px solid var(--primary-color);
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { border-left-color: var(--success-color); }
                .notification-error { border-left-color: var(--error-color); }
                .notification-warning { border-left-color: var(--warning-color); }
                .notification-content { display: flex; align-items: center; gap: 8px; flex: 1; }
                .notification-close { background: none; border: none; cursor: pointer; color: var(--gray-400); }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
};

// Local Storage management
const Storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// Animation utilities
const Animations = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    slideDown: (element, duration = 300) => {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const height = Math.min((progress / duration) * targetHeight, targetHeight);
            
            element.style.height = height + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        };
        
        requestAnimationFrame(animate);
    },

    countUp: (element, target, duration = 2000) => {
        let start = null;
        const startValue = 0;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const value = Math.min((progress / duration) * target, target);
            
            element.textContent = Math.floor(value).toLocaleString();
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data
    loadAppData();
    
    // Initialize current page functionality
    initializeCurrentPage();
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    // Start periodic updates
    startPeriodicUpdates();
}

function loadAppData() {
    // Load user data
    AppState.user = Storage.get('ecotech_user') || null;
    
    // Load devices
    AppState.devices = Storage.get('ecotech_devices') || [];
    
    // Load reports
    AppState.reports = Storage.get('ecotech_reports') || [];
    
    // Load recycling centers
    AppState.recyclingCenters = Storage.get('ecotech_centers') || getDefaultRecyclingCenters();
}

function getDefaultRecyclingCenters() {
    return [
        {
            id: 'center-1',
            name: 'TechRecycle Solutions',
            address: '123 Green Street, Downtown, NY 10001',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
            services: ['Smartphones', 'Computers', 'Appliances', 'Batteries'],
            rating: 4.8,
            reviews: 127,
            certified: true,
            pickup: true
        },
        {
            id: 'center-2',
            name: 'EcoRecover Center',
            address: '456 Recycle Avenue, Midtown, NY 10002',
            phone: '(555) 987-6543',
            hours: 'Mon-Sat: 9AM-5PM, Sun: Closed',
            services: ['Computers', 'TVs', 'Gaming'],
            rating: 4.2,
            reviews: 89,
            certified: true,
            pickup: false
        },
        {
            id: 'center-3',
            name: 'Green Electronics Hub',
            address: '789 Sustainability Blvd, Uptown, NY 10003',
            phone: '(555) 456-7890',
            hours: 'Mon-Sun: 7AM-7PM',
            services: ['All Devices', 'Refurbishment', 'Data Destruction'],
            rating: 4.9,
            reviews: 203,
            certified: true,
            pickup: true
        }
    ];
}

function initializeCurrentPage() {
    const currentPath = window.location.pathname;
    const page = currentPath.split('/').pop().replace('.html', '') || 'index';
    
    AppState.currentPage = page;
    
    // Initialize page-specific functionality
    switch (page) {
        case 'index':
            initializeDashboard();
            break;
        case 'calculator':
            initializeCalculator();
            break;
        case 'locator':
            initializeLocator();
            break;
        case 'tracker':
            initializeTracker();
            break;
        case 'education':
            initializeEducation();
            break;
        case 'report':
            initializeReport();
            break;
        case 'stats':
            initializeStats();
            break;
    }
}

function initializeDashboard() {
    // Animate stats on load
    const statNumbers = document.querySelectorAll('.stat-info h3');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            const text = stat.textContent;
            const number = parseFloat(text.replace(/[^\d.]/g, ''));
            if (!isNaN(number)) {
                stat.textContent = '0';
                Animations.countUp(stat, number, 1500);
                // Restore original format after animation
                setTimeout(() => {
                    stat.textContent = text;
                }, 1600);
            }
        }, index * 200);
    });
    
    // Add hover effects to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });
}

function setupGlobalEventListeners() {
    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            handleFormSubmission(e);
        }
    });
    
    // Handle button clicks
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (button) {
            handleButtonClick(e, button);
        }
    });
    
    // Handle input changes
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            handleInputChange(e);
        }
    });
}

function handleFormSubmission(e) {
    const form = e.target;
    const formId = form.id;
    
    // Prevent default submission for custom handling
    e.preventDefault();
    
    switch (formId) {
        case 'ewasteForm':
            handleCalculatorSubmission(form);
            break;
        case 'reportForm':
            handleReportSubmission(form);
            break;
        case 'addDeviceForm':
            handleAddDeviceSubmission(form);
            break;
        default:
            console.log('Form submitted:', formId);
    }
}

function handleButtonClick(e, button) {
    const buttonText = button.textContent.trim();
    const buttonClass = button.className;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Handle specific button actions
    if (buttonClass.includes('btn-primary')) {
        // Primary button clicked
        console.log('Primary button clicked:', buttonText);
    }
}

function handleInputChange(e) {
    const input = e.target;
    const inputType = input.type;
    const inputValue = input.value;
    
    // Add validation feedback
    if (input.hasAttribute('required') && !inputValue.trim()) {
        input.style.borderColor = 'var(--error-color)';
    } else {
        input.style.borderColor = 'var(--gray-300)';
    }
    
    // Handle specific input types
    if (inputType === 'email') {
        validateEmail(input);
    } else if (inputType === 'tel') {
        validatePhone(input);
    }
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    if (input.value && !isValid) {
        input.style.borderColor = 'var(--error-color)';
        showValidationMessage(input, 'Please enter a valid email address');
    } else {
        input.style.borderColor = 'var(--success-color)';
        hideValidationMessage(input);
    }
}

function validatePhone(input) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const isValid = phoneRegex.test(input.value);
    
    if (input.value && !isValid) {
        input.style.borderColor = 'var(--error-color)';
        showValidationMessage(input, 'Please enter a valid phone number');
    } else {
        input.style.borderColor = 'var(--success-color)';
        hideValidationMessage(input);
    }
}

function showValidationMessage(input, message) {
    let messageElement = input.parentElement.querySelector('.validation-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'validation-message';
        messageElement.style.cssText = `
            color: var(--error-color);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
        `;
        input.parentElement.appendChild(messageElement);
    }
    messageElement.textContent = message;
}

function hideValidationMessage(input) {
    const messageElement = input.parentElement.querySelector('.validation-message');
    if (messageElement) {
        messageElement.remove();
    }
}

function startPeriodicUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        updateGlobalStats();
    }, 30000);
    
    // Save app state every 5 minutes
    setInterval(() => {
        saveAppState();
    }, 300000);
}

function updateGlobalStats() {
    // Simulate real-time updates
    const statElements = document.querySelectorAll('.stat-info h3');
    statElements.forEach(stat => {
        const currentText = stat.textContent;
        const number = parseFloat(currentText.replace(/[^\d.]/g, ''));
        if (!isNaN(number)) {
            // Small random variation
            const variation = (Math.random() - 0.5) * 0.02; // ±1%
            const newNumber = number * (1 + variation);
            const formattedNumber = currentText.includes('M') ? 
                newNumber.toFixed(1) + 'M' : 
                Math.round(newNumber).toLocaleString();
            stat.textContent = formattedNumber;
        }
    });
}

function saveAppState() {
    Storage.set('ecotech_user', AppState.user);
    Storage.set('ecotech_devices', AppState.devices);
    Storage.set('ecotech_reports', AppState.reports);
    Storage.set('ecotech_centers', AppState.recyclingCenters);
}

// Export utilities for use in other files
window.EcoTech = {
    Utils,
    Storage,
    Animations,
    AppState
};

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    Utils.showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    Utils.showNotification('You are now offline', 'warning');
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Handle Escape key for modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.active');
        if (openModal) {
            openModal.classList.remove('active');
        }
    }
    
    // Handle Enter key for buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

console.log('EcoTech E-Waste Management App initialized successfully!');