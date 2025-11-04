// E-Waste Calculator functionality

const Calculator = {
    // Device data with environmental impact factors
    deviceData: {
        smartphone: {
            name: 'Smartphone',
            avgLifespan: 3,
            carbonFootprint: 85, // kg CO2
            materialValue: 15,
            toxicMaterials: ['Lead', 'Mercury', 'Cadmium', 'Lithium'],
            recyclingRate: 0.15
        },
        laptop: {
            name: 'Laptop',
            avgLifespan: 5,
            carbonFootprint: 300,
            materialValue: 45,
            toxicMaterials: ['Lead', 'Mercury', 'Cadmium', 'Beryllium'],
            recyclingRate: 0.25
        },
        desktop: {
            name: 'Desktop Computer',
            avgLifespan: 6,
            carbonFootprint: 400,
            materialValue: 65,
            toxicMaterials: ['Lead', 'Mercury', 'Cadmium', 'Chromium'],
            recyclingRate: 0.30
        },
        tablet: {
            name: 'Tablet',
            avgLifespan: 4,
            carbonFootprint: 130,
            materialValue: 25,
            toxicMaterials: ['Lead', 'Mercury', 'Lithium'],
            recyclingRate: 0.18
        },
        tv: {
            name: 'Television',
            avgLifespan: 8,
            carbonFootprint: 500,
            materialValue: 35,
            toxicMaterials: ['Lead', 'Mercury', 'Cadmium', 'Phosphor'],
            recyclingRate: 0.35
        },
        gaming: {
            name: 'Gaming Console',
            avgLifespan: 7,
            carbonFootprint: 200,
            materialValue: 40,
            toxicMaterials: ['Lead', 'Mercury', 'Cadmium'],
            recyclingRate: 0.22
        },
        appliance: {
            name: 'Home Appliance',
            avgLifespan: 10,
            carbonFootprint: 600,
            materialValue: 55,
            toxicMaterials: ['Lead', 'Mercury', 'CFCs', 'HCFCs'],
            recyclingRate: 0.40
        }
    },

    // Calculate environmental impact
    calculateImpact: function(deviceType, age, condition, usageHours) {
        const device = this.deviceData[deviceType];
        if (!device) return null;

        // Calculate carbon footprint based on usage
        const dailyEmissions = (device.carbonFootprint / (device.avgLifespan * 365)) * (usageHours / 8);
        const totalEmissions = dailyEmissions * age * 365;

        // Calculate remaining lifespan
        const conditionMultiplier = this.getConditionMultiplier(condition);
        const usageMultiplier = this.getUsageMultiplier(usageHours);
        const remainingLife = Math.max(0, (device.avgLifespan - age) * conditionMultiplier * usageMultiplier);

        // Calculate recycling value
        const ageDepreciation = Math.max(0.1, 1 - (age / device.avgLifespan));
        const conditionValue = this.getConditionValue(condition);
        const recyclingValue = device.materialValue * ageDepreciation * conditionValue;

        return {
            carbonFootprint: Math.round(totalEmissions),
            remainingLife: Math.round(remainingLife * 10) / 10,
            recyclingValue: Math.round(recyclingValue),
            recommendations: this.generateRecommendations(deviceType, age, condition, remainingLife)
        };
    },

    // Get condition multiplier for lifespan calculation
    getConditionMultiplier: function(condition) {
        const multipliers = {
            excellent: 1.2,
            good: 1.0,
            fair: 0.7,
            poor: 0.4,
            broken: 0.1
        };
        return multipliers[condition] || 1.0;
    },

    // Get usage multiplier for lifespan calculation
    getUsageMultiplier: function(hours) {
        if (hours <= 2) return 1.3;
        if (hours <= 4) return 1.1;
        if (hours <= 8) return 1.0;
        if (hours <= 12) return 0.8;
        return 0.6;
    },

    // Get condition value for recycling calculation
    getConditionValue: function(condition) {
        const values = {
            excellent: 0.9,
            good: 0.7,
            fair: 0.5,
            poor: 0.3,
            broken: 0.2
        };
        return values[condition] || 0.5;
    },

    // Generate personalized recommendations
    generateRecommendations: function(deviceType, age, condition, remainingLife) {
        const recommendations = [];
        const device = this.deviceData[deviceType];

        if (remainingLife > 2) {
            recommendations.push('Your device has good remaining lifespan - continue using it!');
            recommendations.push('Regular maintenance can extend its life further');
        } else if (remainingLife > 0.5) {
            recommendations.push('Consider upgrading soon, but maximize current usage');
            recommendations.push('Look for trade-in programs when replacing');
        } else {
            recommendations.push('Time to recycle responsibly at a certified facility');
            recommendations.push('Consider refurbished alternatives for replacement');
        }

        if (condition === 'poor' || condition === 'broken') {
            recommendations.push('Check for repair options before disposal');
            recommendations.push('Remove all personal data before recycling');
        }

        if (device.recyclingRate < 0.3) {
            recommendations.push(`Only ${Math.round(device.recyclingRate * 100)}% of ${device.name.toLowerCase()}s are properly recycled`);
            recommendations.push('Help improve recycling rates by using certified facilities');
        }

        return recommendations;
    }
};

// Initialize calculator when page loads
function initializeCalculator() {
    const form = document.getElementById('ewasteForm');
    if (!form) return;

    // Add form validation
    setupFormValidation();
    
    // Add real-time updates
    setupRealTimeUpdates();
}

function setupFormValidation() {
    const form = document.getElementById('ewasteForm');
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('change', validateForm);
        input.addEventListener('input', validateForm);
    });
}

function validateForm() {
    const form = document.getElementById('ewasteForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('[required]');
    
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });

    submitButton.disabled = !isValid;
    submitButton.style.opacity = isValid ? '1' : '0.6';
}

function setupRealTimeUpdates() {
    const deviceTypeSelect = document.getElementById('deviceType');
    const deviceAgeInput = document.getElementById('deviceAge');
    
    if (deviceTypeSelect) {
        deviceTypeSelect.addEventListener('change', updateDeviceInfo);
    }
    
    if (deviceAgeInput) {
        deviceAgeInput.addEventListener('input', EcoTech.Utils.debounce(updateAgeInfo, 500));
    }
}

function updateDeviceInfo() {
    const deviceType = document.getElementById('deviceType').value;
    if (!deviceType) return;

    const device = Calculator.deviceData[deviceType];
    if (!device) return;

    // Show device-specific information
    showDevicePreview(device);
}

function showDevicePreview(device) {
    let previewElement = document.getElementById('devicePreview');
    if (!previewElement) {
        previewElement = document.createElement('div');
        previewElement.id = 'devicePreview';
        previewElement.className = 'device-preview';
        previewElement.style.cssText = `
            background: var(--gray-50);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin-top: var(--spacing-md);
            border-left: 4px solid var(--primary-color);
        `;
        
        const form = document.querySelector('.calculator-form');
        form.appendChild(previewElement);
    }

    previewElement.innerHTML = `
        <h4 style="margin-bottom: var(--spacing-sm); color: var(--gray-900);">
            <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
            ${device.name} Information
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); font-size: var(--font-size-sm);">
            <div><strong>Average Lifespan:</strong> ${device.avgLifespan} years</div>
            <div><strong>Carbon Footprint:</strong> ${device.carbonFootprint} kg CO₂</div>
            <div><strong>Material Value:</strong> $${device.materialValue}</div>
            <div><strong>Recycling Rate:</strong> ${Math.round(device.recyclingRate * 100)}%</div>
        </div>
        <div style="margin-top: var(--spacing-sm);">
            <strong>Toxic Materials:</strong> ${device.toxicMaterials.join(', ')}
        </div>
    `;

    EcoTech.Animations.slideDown(previewElement);
}

function updateAgeInfo() {
    const age = parseFloat(document.getElementById('deviceAge').value);
    const deviceType = document.getElementById('deviceType').value;
    
    if (!age || !deviceType) return;

    const device = Calculator.deviceData[deviceType];
    if (!device) return;

    const agePercentage = (age / device.avgLifespan) * 100;
    let ageStatus = '';
    let ageColor = '';

    if (agePercentage < 30) {
        ageStatus = 'Very New';
        ageColor = 'var(--success-color)';
    } else if (agePercentage < 60) {
        ageStatus = 'Mature';
        ageColor = 'var(--warning-color)';
    } else if (agePercentage < 90) {
        ageStatus = 'Aging';
        ageColor = 'var(--error-color)';
    } else {
        ageStatus = 'End of Life';
        ageColor = 'var(--error-color)';
    }

    // Show age indicator
    showAgeIndicator(ageStatus, ageColor, agePercentage);
}

function showAgeIndicator(status, color, percentage) {
    let indicator = document.getElementById('ageIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'ageIndicator';
        indicator.style.cssText = `
            margin-top: var(--spacing-sm);
            padding: var(--spacing-sm);
            background: var(--gray-50);
            border-radius: var(--radius-sm);
            border-left: 3px solid ${color};
        `;
        
        const ageInput = document.getElementById('deviceAge');
        ageInput.parentElement.appendChild(indicator);
    }

    indicator.style.borderLeftColor = color;
    indicator.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-xs);">
            <span style="font-weight: 600; color: ${color};">${status}</span>
            <span style="font-size: var(--font-size-sm); color: var(--gray-600);">${Math.round(percentage)}% of expected lifespan</span>
        </div>
        <div style="width: 100%; height: 4px; background: var(--gray-200); border-radius: 2px; overflow: hidden;">
            <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
        </div>
    `;
}

function handleCalculatorSubmission(form) {
    const formData = new FormData(form);
    const data = {
        deviceType: formData.get('deviceType'),
        deviceAge: parseFloat(formData.get('deviceAge')),
        deviceCondition: formData.get('deviceCondition'),
        usageHours: parseFloat(formData.get('usageHours'))
    };

    // Validate data
    if (!data.deviceType || !data.deviceAge || !data.deviceCondition || !data.usageHours) {
        EcoTech.Utils.showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Calculate impact
    const results = Calculator.calculateImpact(
        data.deviceType,
        data.deviceAge,
        data.deviceCondition,
        data.usageHours
    );

    if (!results) {
        EcoTech.Utils.showNotification('Error calculating impact. Please try again.', 'error');
        return;
    }

    // Display results
    displayResults(results);
    
    // Save calculation to history
    saveCalculation(data, results);
    
    EcoTech.Utils.showNotification('Impact calculated successfully!', 'success');
}

function displayResults(results) {
    const resultsContainer = document.getElementById('calculatorResults');
    if (!resultsContainer) return;

    // Update result values
    document.getElementById('carbonFootprint').textContent = results.carbonFootprint.toLocaleString();
    document.getElementById('carbonComparison').textContent = Math.round(results.carbonFootprint * 2.3).toLocaleString();
    document.getElementById('remainingLife').textContent = results.remainingLife;
    document.getElementById('recyclingValue').textContent = results.recyclingValue;

    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    results.recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        li.style.cssText = `
            padding: var(--spacing-sm) 0;
            border-bottom: 1px solid var(--gray-200);
            color: var(--gray-700);
        `;
        recommendationsList.appendChild(li);
    });

    // Show results with animation
    resultsContainer.style.display = 'block';
    EcoTech.Animations.fadeIn(resultsContainer);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveCalculation(data, results) {
    const calculation = {
        id: EcoTech.Utils.generateId(),
        timestamp: new Date().toISOString(),
        device: data,
        results: results
    };

    // Get existing calculations
    const calculations = EcoTech.Storage.get('ecotech_calculations') || [];
    calculations.unshift(calculation);

    // Keep only last 50 calculations
    if (calculations.length > 50) {
        calculations.splice(50);
    }

    // Save to storage
    EcoTech.Storage.set('ecotech_calculations', calculations);
}

// Export calculator functionality
window.Calculator = Calculator;

console.log('E-Waste Calculator initialized');