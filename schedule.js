const API_URL = 'http://localhost:4000/api'

// Check authentication
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user') || '{}')

if (!token || user.role !== 'Citizen') {
    window.location.href = 'auth.html'
}

document.getElementById('userInfo').textContent = `${user.name} (${user.role})`

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'auth.html'
})

// Set minimum date to tomorrow
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
document.getElementById('scheduledDate').min = tomorrow.toISOString().split('T')[0]

// Load e-waste types
let ewasteTypes = []
async function loadEwasteTypes() {
    try {
        const response = await fetch(`${API_URL}/ewaste-types`)
        ewasteTypes = await response.json()
        populateItemSelects()
    } catch (error) {
        console.error('Failed to load e-waste types:', error)
    }
}

function populateItemSelects() {
    const selects = document.querySelectorAll('.item-type')
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select item</option>' +
            ewasteTypes.map(type => `<option value="${type.name}">${type.name}</option>`).join('')
    })
}

function addItem() {
    const itemsList = document.getElementById('itemsList')
    const newItem = document.createElement('div')
    newItem.className = 'item-row'
    newItem.innerHTML = `
        <div class="form-group">
            <label>Item Type *</label>
            <select class="item-type" required>
                <option value="">Select item</option>
                ${ewasteTypes.map(type => `<option value="${type.name}">${type.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Estimated Weight (kg) *</label>
            <input type="number" class="item-weight" min="0.1" step="0.1" required>
        </div>
        <button type="button" class="btn-icon btn-remove" onclick="removeItem(this)">
            <i class="fas fa-trash"></i>
        </button>
    `
    itemsList.appendChild(newItem)
    updateRemoveButtons()
}

function removeItem(button) {
    button.closest('.item-row').remove()
    updateRemoveButtons()
}

function updateRemoveButtons() {
    const items = document.querySelectorAll('.item-row')
    items.forEach((item, index) => {
        const removeBtn = item.querySelector('.btn-remove')
        if (removeBtn) {
            removeBtn.style.display = items.length > 1 ? 'inline-flex' : 'none'
        }
    })
}

// Handle form submission
document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const address = document.getElementById('address').value
    const scheduledDate = document.getElementById('scheduledDate').value
    const timeSlot = document.getElementById('timeSlot').value
    
    // Collect items
    const itemRows = document.querySelectorAll('.item-row')
    const pickupDetails = []
    
    for (const row of itemRows) {
        const name = row.querySelector('.item-type').value
        const weight = parseFloat(row.querySelector('.item-weight').value)
        
        if (name && weight) {
            pickupDetails.push({
                name,
                estimatedWeightKg: weight
            })
        }
    }
    
    if (pickupDetails.length === 0) {
        showMessage('Please add at least one item', 'error')
        return
    }
    
    try {
        const response = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address,
                scheduledDate,
                timeSlot,
                pickupDetails
            })
        })
        
        const data = await response.json()
        
        if (response.ok) {
            showMessage('Pickup scheduled successfully! Redirecting to dashboard...', 'success')
            setTimeout(() => window.location.href = 'dashboard.html', 2000)
        } else {
            showMessage(data.message || 'Failed to schedule pickup', 'error')
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error')
    }
})

function showMessage(message, type) {
    const messageEl = document.getElementById('scheduleMessage')
    messageEl.textContent = message
    messageEl.className = `schedule-message ${type}`
    messageEl.style.display = 'block'
    
    if (type === 'success') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

// Load e-waste types on page load
loadEwasteTypes()
