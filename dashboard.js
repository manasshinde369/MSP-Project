const API_URL = 'http://localhost:4000/api'

// Check authentication
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user') || '{}')

if (!token) {
    window.location.href = 'auth.html'
}

// Set user info
document.getElementById('userInfo').textContent = `${user.name} (${user.role})`

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'auth.html'
})

// Show appropriate dashboard based on role
async function loadDashboard() {
    const role = user.role
    
    document.getElementById('dashboardTitle').textContent = `${role} Dashboard`
    document.getElementById('dashboardSubtitle').textContent = `Welcome back, ${user.name}!`
    
    if (role === 'Citizen') {
        document.getElementById('scheduleLink').style.display = 'block'
        document.getElementById('citizenDashboard').style.display = 'block'
        await loadCitizenDashboard()
    } else if (role === 'Agent') {
        document.getElementById('agentDashboard').style.display = 'block'
        await loadAgentDashboard()
    } else if (role === 'Admin') {
        document.getElementById('adminDashboard').style.display = 'block'
        await loadAdminDashboard()
    }
}

async function loadCitizenDashboard() {
    try {
        const response = await fetch(`${API_URL}/requests/mine`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const requests = await response.json()
        
        const pending = requests.filter(r => r.status === 'Pending' || r.status === 'Scheduled')
        const completed = requests.filter(r => r.status === 'Completed')
        
        document.getElementById('citizenPendingCount').textContent = pending.length
        document.getElementById('citizenCompletedCount').textContent = completed.length
        
        renderCitizenRequests(requests)
    } catch (error) {
        console.error('Failed to load requests:', error)
    }
}

async function loadAgentDashboard() {
    try {
        const response = await fetch(`${API_URL}/requests/agent`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const requests = await response.json()
        
        const assigned = requests.filter(r => r.status !== 'Completed')
        const completed = requests.filter(r => r.status === 'Completed')
        
        document.getElementById('agentAssignedCount').textContent = assigned.length
        document.getElementById('agentCompletedCount').textContent = completed.length
        
        renderAgentRequests(requests)
    } catch (error) {
        console.error('Failed to load requests:', error)
    }
}

async function loadAdminDashboard() {
    try {
        const response = await fetch(`${API_URL}/requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const requests = await response.json()
        
        const pending = requests.filter(r => r.status === 'Pending')
        const scheduled = requests.filter(r => r.status === 'Scheduled' || r.status === 'In Progress')
        const completed = requests.filter(r => r.status === 'Completed')
        
        document.getElementById('adminPendingCount').textContent = pending.length
        document.getElementById('adminScheduledCount').textContent = scheduled.length
        document.getElementById('adminCompletedCount').textContent = completed.length
        
        renderAdminRequests(requests)
    } catch (error) {
        console.error('Failed to load requests:', error)
    }
}

function renderCitizenRequests(requests) {
    const container = document.getElementById('citizenRequests')
    if (requests.length === 0) {
        container.innerHTML = '<p>No collection requests yet. <a href="schedule.html">Schedule your first pickup</a></p>'
        return
    }
    
    container.innerHTML = requests.map(req => `
        <div class="request-card">
            <div class="request-header">
                <h3>Request #${req.id}</h3>
                <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span>
            </div>
            <p><i class="fas fa-map-marker-alt"></i> ${req.address}</p>
            <p><i class="fas fa-calendar"></i> ${new Date(req.scheduledDate).toLocaleDateString()} at ${req.timeSlot}</p>
            <p><i class="fas fa-box"></i> ${req.pickupDetails.length} items</p>
            ${req.agent ? `<p><i class="fas fa-user"></i> Agent: ${req.agent.name} (${req.agent.phone})</p>` : ''}
        </div>
    `).join('')
}

function renderAgentRequests(requests) {
    const container = document.getElementById('agentRequests')
    if (requests.length === 0) {
        container.innerHTML = '<p>No assigned pickups.</p>'
        return
    }
    
    container.innerHTML = requests.map(req => `
        <div class="request-card">
            <div class="request-header">
                <h3>Request #${req.id}</h3>
                <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span>
            </div>
            <p><i class="fas fa-user"></i> ${req.citizen.name} (${req.citizen.phone})</p>
            <p><i class="fas fa-map-marker-alt"></i> ${req.address}</p>
            <p><i class="fas fa-calendar"></i> ${new Date(req.scheduledDate).toLocaleDateString()} at ${req.timeSlot}</p>
            <p><i class="fas fa-box"></i> ${req.pickupDetails.length} items</p>
            ${req.status !== 'Completed' ? `
                <button class="btn btn-primary btn-sm" onclick="updateStatus(${req.id}, 'In Progress')">Start Pickup</button>
                <button class="btn btn-success btn-sm" onclick="completePickup(${req.id})">Complete</button>
            ` : ''}
        </div>
    `).join('')
}

function renderAdminRequests(requests) {
    const container = document.getElementById('adminRequests')
    if (requests.length === 0) {
        container.innerHTML = '<p>No requests in the system.</p>'
        return
    }
    
    container.innerHTML = requests.map(req => `
        <div class="request-card">
            <div class="request-header">
                <h3>Request #${req.id}</h3>
                <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span>
            </div>
            <p><i class="fas fa-user"></i> Citizen: ${req.citizen.name} (${req.citizen.email})</p>
            <p><i class="fas fa-map-marker-alt"></i> ${req.address}</p>
            <p><i class="fas fa-calendar"></i> ${new Date(req.scheduledDate).toLocaleDateString()} at ${req.timeSlot}</p>
            <p><i class="fas fa-box"></i> ${req.pickupDetails.length} items</p>
            ${req.agent ? `<p><i class="fas fa-truck"></i> Agent: ${req.agent.name}</p>` : '<p class="text-warning">⚠️ Not assigned</p>'}
        </div>
    `).join('')
}

async function updateStatus(requestId, status) {
    try {
        await fetch(`${API_URL}/requests/${requestId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        })
        loadDashboard()
    } catch (error) {
        alert('Failed to update status')
    }
}

async function completePickup(requestId) {
    const weight = prompt('Enter actual weight collected (kg):')
    const notes = prompt('Completion notes (optional):')
    
    if (weight) {
        try {
            await fetch(`${API_URL}/requests/${requestId}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ actualWeightKg: parseFloat(weight), completionNotes: notes })
            })
            loadDashboard()
        } catch (error) {
            alert('Failed to complete pickup')
        }
    }
}

// Load dashboard on page load
loadDashboard()
