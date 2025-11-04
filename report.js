// E-Waste Reporting functionality

const Reporter = {
    currentReportType: null,
    reportData: {},
    
    // Report type configurations
    reportTypes: {
        'illegal-dumping': {
            name: 'Illegal Dumping',
            icon: 'fas fa-dumpster',
            description: 'Electronics dumped in unauthorized locations',
            severity: 'high',
            requiredFields: ['location', 'description', 'deviceTypes'],
            urgency: 'immediate'
        },
        'unsafe-disposal': {
            name: 'Unsafe Disposal',
            icon: 'fas fa-exclamation-triangle',
            description: 'Improper handling of hazardous electronic components',
            severity: 'high',
            requiredFields: ['location', 'description', 'hazardType'],
            urgency: 'urgent'
        },
        'facility-issue': {
            name: 'Facility Issues',
            icon: 'fas fa-industry',
            description: 'Problems with recycling centers or collection points',
            severity: 'medium',
            requiredFields: ['location', 'description', 'facilityName'],
            urgency: 'normal'
        },
        'educational': {
            name: 'Awareness Need',
            icon: 'fas fa-lightbulb',
            description: 'Areas needing better e-waste education and outreach',
            severity: 'low',
            requiredFields: ['location', 'description', 'targetAudience'],
            urgency: 'low'
        }
    },

    // Initialize reporter
    init: function() {
        this.setupEventListeners();
        this.loadRecentReports();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Report type selection
        const reportOptions = document.querySelectorAll('.report-option');
        reportOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectReportType(e.currentTarget);
            });
        });

        // Form submission
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReportSubmission(reportForm);
            });
        }

        // Anonymous checkbox
        const anonymousCheckbox = document.getElementById('reportAnonymous');
        if (anonymousCheckbox) {
            anonymousCheckbox.addEventListener('change', (e) => {
                this.toggleAnonymousMode(e.target.checked);
            });
        }

        // Photo upload
        const photoInput = document.getElementById('reportPhotos');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.handlePhotoUpload(e.target.files);
            });
        }
    },

    // Select report type
    selectReportType: function(optionElement) {
        // Remove previous selection
        document.querySelectorAll('.report-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        optionElement.classList.add('selected');

        // Get report type from onclick attribute or data
        const reportType = optionElement.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (reportType) {
            this.currentReportType = reportType;
            this.showReportForm();
            this.customizeFormForType(reportType);
        }
    },

    // Show report form
    showReportForm: function() {
        const formContainer = document.getElementById('reportFormContainer');
        if (formContainer) {
            formContainer.style.display = 'block';
            EcoTech.Animations.slideDown(formContainer);
            
            // Scroll to form
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // Customize form based on report type
    customizeFormForType: function(reportType) {
        const config = this.reportTypes[reportType];
        if (!config) return;

        // Update form title
        const formTitle = document.querySelector('#reportFormContainer h2');
        if (formTitle) {
            formTitle.innerHTML = `
                <i class="${config.icon}" style="color: var(--primary-color); margin-right: var(--spacing-sm);"></i>
                Report ${config.name}
            `;
        }

        // Add type-specific fields
        this.addTypeSpecificFields(reportType, config);

        // Update severity indicator
        this.updateSeverityIndicator(config.severity);
    },

    // Add type-specific fields
    addTypeSpecificFields: function(reportType, config) {
        const issueDetailsSection = document.querySelector('.form-section:nth-child(2)');
        if (!issueDetailsSection) return;

        // Remove existing type-specific fields
        const existingFields = issueDetailsSection.querySelectorAll('.type-specific-field');
        existingFields.forEach(field => field.remove());

        // Add new fields based on type
        switch (reportType) {
            case 'illegal-dumping':
                this.addDumpingFields(issueDetailsSection);
                break;
            case 'unsafe-disposal':
                this.addUnsafeDisposalFields(issueDetailsSection);
                break;
            case 'facility-issue':
                this.addFacilityFields(issueDetailsSection);
                break;
            case 'educational':
                this.addEducationalFields(issueDetailsSection);
                break;
        }
    },

    // Add dumping-specific fields
    addDumpingFields: function(section) {
        const field = document.createElement('div');
        field.className = 'form-group type-specific-field';
        field.innerHTML = `
            <label for="dumpingSize">Estimated Size of Dumping</label>
            <select id="dumpingSize" required>
                <option value="">Select size</option>
                <option value="small">Small (few items)</option>
                <option value="medium">Medium (truck load)</option>
                <option value="large">Large (multiple trucks)</option>
                <option value="massive">Massive (industrial scale)</option>
            </select>
        `;
        section.appendChild(field);
    },

    // Add unsafe disposal fields
    addUnsafeDisposalFields: function(section) {
        const field = document.createElement('div');
        field.className = 'form-group type-specific-field';
        field.innerHTML = `
            <label for="hazardType">Type of Hazard</label>
            <select id="hazardType" required>
                <option value="">Select hazard type</option>
                <option value="chemical">Chemical leakage</option>
                <option value="fire">Fire hazard</option>
                <option value="toxic">Toxic material exposure</option>
                <option value="radiation">Radiation concern</option>
                <option value="other">Other safety concern</option>
            </select>
        `;
        section.appendChild(field);
    },

    // Add facility-specific fields
    addFacilityFields: function(section) {
        const field = document.createElement('div');
        field.className = 'form-group type-specific-field';
        field.innerHTML = `
            <label for="facilityName">Facility Name</label>
            <input type="text" id="facilityName" required placeholder="Name of the recycling center or facility">
        `;
        section.appendChild(field);
    },

    // Add educational fields
    addEducationalFields: function(section) {
        const field = document.createElement('div');
        field.className = 'form-group type-specific-field';
        field.innerHTML = `
            <label for="targetAudience">Target Audience</label>
            <select id="targetAudience" required>
                <option value="">Select audience</option>
                <option value="residential">Residential community</option>
                <option value="business">Business district</option>
                <option value="school">Schools/Educational</option>
                <option value="government">Government offices</option>
                <option value="industrial">Industrial area</option>
            </select>
        `;
        section.appendChild(field);
    },

    // Update severity indicator
    updateSeverityIndicator: function(severity) {
        const severitySelect = document.getElementById('reportSeverity');
        if (severitySelect) {
            // Pre-select appropriate severity
            const severityMap = {
                'low': 'low',
                'medium': 'medium',
                'high': 'high'
            };
            severitySelect.value = severityMap[severity] || 'medium';
        }
    },

    // Toggle anonymous mode
    toggleAnonymousMode: function(isAnonymous) {
        const contactSection = document.querySelector('.form-section:nth-child(3)');
        const contactInputs = contactSection.querySelectorAll('input');
        
        contactInputs.forEach(input => {
            if (isAnonymous) {
                input.disabled = true;
                input.style.opacity = '0.5';
                input.value = '';
            } else {
                input.disabled = false;
                input.style.opacity = '1';
            }
        });

        // Update section title
        const sectionTitle = contactSection.querySelector('h3');
        if (sectionTitle) {
            sectionTitle.textContent = isAnonymous ? 
                'Contact Information (Disabled - Anonymous Report)' : 
                'Contact Information (Optional)';
        }
    },

    // Handle photo upload
    handlePhotoUpload: function(files) {
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024; // 10MB per file

        if (files.length > maxFiles) {
            EcoTech.Utils.showNotification(`Maximum ${maxFiles} files allowed`, 'error');
            return;
        }

        let validFiles = 0;
        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                EcoTech.Utils.showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
            } else if (!file.type.startsWith('image/')) {
                EcoTech.Utils.showNotification(`File ${file.name} is not an image`, 'error');
            } else {
                validFiles++;
            }
        });

        if (validFiles > 0) {
            this.showPhotoPreview(files);
            EcoTech.Utils.showNotification(`${validFiles} photo(s) ready for upload`, 'success');
        }
    },

    // Show photo preview
    showPhotoPreview: function(files) {
        let previewContainer = document.getElementById('photoPreview');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'photoPreview';
            previewContainer.style.cssText = `
                margin-top: var(--spacing-md);
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: var(--spacing-sm);
            `;
            
            const photoInput = document.getElementById('reportPhotos');
            photoInput.parentElement.appendChild(previewContainer);
        }

        previewContainer.innerHTML = '';

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement('div');
                    preview.style.cssText = `
                        position: relative;
                        width: 100px;
                        height: 100px;
                        border-radius: var(--radius-md);
                        overflow: hidden;
                        border: 2px solid var(--gray-200);
                    `;
                    preview.innerHTML = `
                        <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                        <button type="button" onclick="this.parentElement.remove()" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(0,0,0,0.7);
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            font-size: 12px;
                            cursor: pointer;
                        ">&times;</button>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    },

    // Handle report submission
    handleReportSubmission: function(form) {
        const formData = new FormData(form);
        
        // Validate required fields
        if (!this.validateForm(formData)) {
            return;
        }

        // Create report object
        const report = this.createReportObject(formData);
        
        // Show loading state
        this.showSubmissionLoading();
        
        // Simulate submission
        setTimeout(() => {
            this.submitReport(report);
        }, 2000);
    },

    // Validate form
    validateForm: function(formData) {
        const requiredFields = ['reportAddress', 'reportCity', 'reportState', 'reportZip', 'reportDescription', 'reportSeverity'];
        
        for (const field of requiredFields) {
            if (!formData.get(field)?.trim()) {
                EcoTech.Utils.showNotification(`Please fill in the ${field.replace('report', '').toLowerCase()} field`, 'error');
                return false;
            }
        }

        // Check device types
        const deviceTypes = formData.getAll('deviceTypes');
        if (deviceTypes.length === 0) {
            EcoTech.Utils.showNotification('Please select at least one device type', 'error');
            return false;
        }

        // Check consent
        if (!formData.get('reportConsent')) {
            EcoTech.Utils.showNotification('Please consent to information processing', 'error');
            return false;
        }

        return true;
    },

    // Create report object
    createReportObject: function(formData) {
        const report = {
            id: EcoTech.Utils.generateId(),
            type: this.currentReportType,
            timestamp: new Date().toISOString(),
            location: {
                address: formData.get('reportAddress'),
                city: formData.get('reportCity'),
                state: formData.get('reportState'),
                zip: formData.get('reportZip')
            },
            description: formData.get('reportDescription'),
            severity: formData.get('reportSeverity'),
            deviceTypes: formData.getAll('deviceTypes'),
            contact: {
                name: formData.get('reporterName'),
                email: formData.get('reporterEmail'),
                phone: formData.get('reporterPhone')
            },
            anonymous: formData.get('reportAnonymous') === 'on',
            status: 'pending',
            photos: [] // In real app, would handle file uploads
        };

        // Add type-specific data
        this.addTypeSpecificData(report, formData);

        return report;
    },

    // Add type-specific data to report
    addTypeSpecificData: function(report, formData) {
        switch (this.currentReportType) {
            case 'illegal-dumping':
                report.dumpingSize = formData.get('dumpingSize');
                break;
            case 'unsafe-disposal':
                report.hazardType = formData.get('hazardType');
                break;
            case 'facility-issue':
                report.facilityName = formData.get('facilityName');
                break;
            case 'educational':
                report.targetAudience = formData.get('targetAudience');
                break;
        }
    },

    // Show submission loading
    showSubmissionLoading: function() {
        const submitButton = document.querySelector('#reportForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Report...';
        }
    },

    // Submit report
    submitReport: function(report) {
        // Save to storage
        const reports = EcoTech.Storage.get('ewaste_reports') || [];
        reports.unshift(report);
        EcoTech.Storage.set('ewaste_reports', reports);

        // Show success message
        EcoTech.Utils.showNotification('Report submitted successfully! Thank you for helping protect the environment.', 'success');

        // Reset form
        this.resetForm();

        // Update recent reports
        this.loadRecentReports();

        // Generate report ID for user
        this.showReportConfirmation(report);
    },

    // Show report confirmation
    showReportConfirmation: function(report) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: var(--success-color);">
                        <i class="fas fa-check-circle"></i>
                        Report Submitted
                    </h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: var(--spacing-lg); text-align: center;">
                    <div style="background: var(--gray-50); padding: var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg);">
                        <h3 style="margin-bottom: var(--spacing-sm);">Report ID</h3>
                        <code style="font-size: var(--font-size-lg); font-weight: 600; color: var(--primary-color);">${report.id.toUpperCase()}</code>
                        <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--gray-600);">
                            Save this ID for tracking your report
                        </p>
                    </div>
                    
                    <div style="text-align: left; margin-bottom: var(--spacing-lg);">
                        <h4 style="margin-bottom: var(--spacing-sm);">What happens next?</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: var(--spacing-xs) 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                <i class="fas fa-clock" style="color: var(--primary-color);"></i>
                                Your report will be reviewed within 24 hours
                            </li>
                            <li style="padding: var(--spacing-xs) 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                <i class="fas fa-user-check" style="color: var(--primary-color);"></i>
                                Relevant authorities will be notified if needed
                            </li>
                            <li style="padding: var(--spacing-xs) 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                <i class="fas fa-envelope" style="color: var(--primary-color);"></i>
                                ${report.anonymous ? 'Updates will be posted publicly' : 'You\'ll receive email updates'}
                            </li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                        Got it, thanks!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    },

    // Reset form
    resetForm: function() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.reset();
        }

        // Reset form container
        const formContainer = document.getElementById('reportFormContainer');
        if (formContainer) {
            formContainer.style.display = 'none';
        }

        // Reset report type selection
        document.querySelectorAll('.report-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Reset submit button
        const submitButton = document.querySelector('#reportForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit Report';
        }

        // Clear photo preview
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview) {
            photoPreview.remove();
        }

        this.currentReportType = null;
    },

    // Load recent reports
    loadRecentReports: function() {
        const reports = EcoTech.Storage.get('ewaste_reports') || [];
        const recentReports = reports.slice(0, 5); // Show last 5 reports

        this.renderRecentReports(recentReports);
    },

    // Render recent reports
    renderRecentReports: function(reports) {
        const reportsList = document.querySelector('.reports-list');
        if (!reportsList) return;

        // Clear existing reports (keep demo reports)
        const existingReports = reportsList.querySelectorAll('.report-item');
        existingReports.forEach((item, index) => {
            if (index >= 3) { // Keep first 3 demo reports
                item.remove();
            }
        });

        // Add new reports
        reports.forEach(report => {
            const reportItem = this.createReportItem(report);
            reportsList.appendChild(reportItem);
        });
    },

    // Create report item element
    createReportItem: function(report) {
        const config = this.reportTypes[report.type];
        const timeAgo = this.getTimeAgo(report.timestamp);

        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <div class="report-status ${report.status}">
                <i class="fas fa-${this.getStatusIcon(report.status)}"></i>
                <span>${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
            </div>
            <div class="report-content">
                <h4>${config.name} - ${report.location.city}</h4>
                <p>${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
                <div class="report-meta">
                    <span><i class="fas fa-calendar"></i> ${timeAgo}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${report.location.city}, ${report.location.state}</span>
                    <span><i class="fas fa-exclamation-triangle"></i> ${report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Priority</span>
                </div>
            </div>
        `;

        return item;
    },

    // Get status icon
    getStatusIcon: function(status) {
        const icons = {
            pending: 'hourglass-half',
            'in-progress': 'clock',
            resolved: 'check-circle'
        };
        return icons[status] || 'hourglass-half';
    },

    // Get time ago string
    getTimeAgo: function(timestamp) {
        const now = new Date();
        const reportTime = new Date(timestamp);
        const diffMs = now - reportTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
};

// Initialize reporter
function initializeReport() {
    Reporter.init();
}

// Global functions for report type selection
window.selectReportType = function(reportType) {
    Reporter.currentReportType = reportType;
    Reporter.showReportForm();
    Reporter.customizeFormForType(reportType);
};

// Global function for form reset
window.resetReportForm = function() {
    Reporter.resetForm();
};

// Handle report form submission
function handleReportSubmission(form) {
    Reporter.handleReportSubmission(form);
}

// Export reporter functionality
window.Reporter = Reporter;

console.log('E-Waste Reporter initialized');