// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const eventsContainer = document.getElementById('eventsContainer');

// Base URL for backend API (update if deployed)
const API_BASE_URL = 'http://localhost:3000/api';

// Example: Fetch events from backend
async function fetchEvents(query = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/events?search=${query}`);
        const events = await response.json();
        displayEvents(events);
    } catch (err) {
        console.error('Error fetching events:', err);
    }
}

// Display events in the UI
function displayEvents(events) {
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.date}</p>
            <p>${event.location}</p>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchEvents(searchInput.value);
});

// Initialize: Fetch all events on page load
fetchEvents();

// Modal Handling
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
});

// Close modals when clicking 'X'
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === signupModal) {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
});