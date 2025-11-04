const API_URL = 'http://localhost:4000/api'

// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html'
}

// Toggle between login and register
document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('loginForm').style.display = 'none'
    document.getElementById('registerForm').style.display = 'block'
    document.getElementById('authMessage').textContent = ''
})

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('registerForm').style.display = 'none'
    document.getElementById('loginForm').style.display = 'block'
    document.getElementById('authMessage').textContent = ''
})

// Login
document.getElementById('loginFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        
        const data = await response.json()
        
        if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            showMessage('Login successful! Redirecting...', 'success')
            setTimeout(() => window.location.href = 'dashboard.html', 1000)
        } else {
            showMessage(data.message || 'Login failed', 'error')
        }
    } catch (error) {
        showMessage('Network error. Please check if the server is running.', 'error')
    }
})

// Register
document.getElementById('registerFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('registerName').value
    const email = document.getElementById('registerEmail').value
    const password = document.getElementById('registerPassword').value
    const role = document.getElementById('registerRole').value
    const address = document.getElementById('registerAddress').value
    const phone = document.getElementById('registerPhone').value
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, address, phone })
        })
        
        const data = await response.json()
        
        if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            showMessage('Registration successful! Redirecting...', 'success')
            setTimeout(() => window.location.href = 'dashboard.html', 1000)
        } else {
            showMessage(data.message || 'Registration failed', 'error')
        }
    } catch (error) {
        showMessage('Network error. Please check if the server is running.', 'error')
    }
})

function showMessage(message, type) {
    const messageEl = document.getElementById('authMessage')
    messageEl.textContent = message
    messageEl.className = `auth-message ${type}`
    messageEl.style.display = 'block'
}
