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