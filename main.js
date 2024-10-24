// Show specific section when clicked in the navbar
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Display the clicked section
    document.getElementById(sectionId).style.display = 'block';
}


// API base URL
const API_BASE_URL = 'http://localhost:8080/events';

// Function to make API requests
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Reusable function to clear form fields
function clearFormFields(formId) {
    document.querySelectorAll(`#${formId} input`).forEach(input => input.value = '');
}

// Create Event Functionality
async function createNewEvent() {
    const name = document.getElementById('createName').value;
    const date = document.getElementById('createDate').value;
    const location = document.getElementById('createLocation').value;
    const freePrice = document.getElementById('priceFree').value;
    const advancedPrice = document.getElementById('priceAdvanced').value;
    const proPrice = document.getElementById('pricePro').value;

    if (name && date && location && freePrice && advancedPrice && proPrice) {
        // Create event object
        const newEvent = {
            name: name,
            date: date,
            location: location,
            pricing: {
                free: parseFloat(freePrice),
                advanced: parseFloat(advancedPrice),
                pro: parseFloat(proPrice)
            }
        };

        // Send POST request to create the event
        const response = await makeApiRequest('/', 'POST', newEvent);

        if (response) {
            alert(`Event Created: ${name} on ${date}`);
            loadEvents();  // Refresh the event list
            clearFormFields('createEventForm');
        }
    } else {
        alert('Please provide valid event details.');
    }
}

// Edit Event Functionality
async function editEvent() {
    const name = document.getElementById('editName').value;
    const date = document.getElementById('editDate').value;
    const location = document.getElementById('editLocation').value;
    const freePrice = document.getElementById('editPriceFree').value;
    const advancedPrice = document.getElementById('editPriceAdvanced').value;
    const proPrice = document.getElementById('editPricePro').value;

    // Get the existing event data from the backend
    const events = await makeApiRequest('/');
    const event = events.find(e => e.name === name);

    if (event) {
        // Update the event details
        const updatedEvent = {
            name: name,
            date: date,
            location: location,
            pricing: {
                free: parseFloat(freePrice),
                advanced: parseFloat(advancedPrice),
                pro: parseFloat(proPrice)
            }
        };

        // Send PUT request to update the event
        const response = await makeApiRequest(`/${event._id}`, 'PUT', updatedEvent);

        if (response) {
            alert(`Event Updated: ${name} on ${date}`);
            loadEvents();  // Refresh the event list
            clearFormFields('editEventForm');
        }
    } else {
        alert('Event not found. Please provide a valid event name.');
    }
}

// Delete Event Functionality
async function deleteEvent() {
    const name = document.getElementById('deleteName').value;

    // Get the existing event data from the backend
    const events = await makeApiRequest('/');
    const event = events.find(e => e.name === name);

    if (event) {
        // Send DELETE request to remove the event
        const response = await makeApiRequest(`/${event._id}`, 'DELETE');

        if (response) {
            alert(`Event Deleted: ${name}`);
            loadEvents();  // Refresh the event list
            clearFormFields('deleteEventForm');
        }
    } else {
        alert('Event not found. Please provide a valid event name.');
    }
}

// Load events from the backend and display them as cards
async function loadEvents() {
    const events = await makeApiRequest('/');
    const eventsSection = document.getElementById('eventsSection');
    eventsSection.innerHTML = ''; // Clear previous content

    if (events.length > 0) {
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p>Location: ${event.location}</p>
                <button onclick="showPricing('${event.name}')">Show Pricing</button>
            `;

            eventsSection.appendChild(eventCard);
        });
    } else {
        eventsSection.innerHTML = '<p>No events available. Please create some events.</p>';
    }
}

let selectedPricing = null;
let selectedEventName = null;

// Show pricing for a specific event
async function showPricing(eventName) {
    const events = await makeApiRequest('/');
    const event = events.find(e => e.name === eventName);

    if (event) {
        selectedEventName = eventName;
        document.getElementById('basicPrice').textContent = `$${event.pricing.free}`;
        document.getElementById('advancedPrice').textContent = `$${event.pricing.advanced}`;
        document.getElementById('proPrice').textContent = `$${event.pricing.pro}`;
        document.getElementById('pricingSection').style.display = 'block';
    }
}

function choosePricing(pricingOption) {
    selectedPricing = pricingOption;
    // Display the modal to collect email
    const modal = new bootstrap.Modal(document.getElementById('emailModal'));
    modal.show();
}


async function registerForEvent() {
    const email = document.getElementById('emailInputModal').value;
    if (!email || !selectedPricing || !selectedEventName) {
        alert('Please fill in all the required fields!');
        return;
    }

    try {
        const events = await makeApiRequest('/');
        const event = events.find(e => e.name === selectedEventName);

        if (event) {
            // Update the fetch URL to the correct backend server URL
            const response = await fetch(`http://localhost:8080/events/${event._id}/register`, {  // Correct backend URL here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    pricingOption: selectedPricing
                })
            });

            if (response.ok) {
                const result = await response.json();
                const modal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
                modal.hide();
                alert('Registration successful! Check your email for confirmation.');
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        }
    } catch (err) {
       // handle error
    }
}

// Search events based on input
async function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const events = await makeApiRequest('/');
    const eventsSection = document.getElementById('eventsSection');
    eventsSection.innerHTML = ''; // Clear previous content

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)
    );

    if (filteredEvents.length > 0) {
        filteredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p>Location: ${event.location}</p>
                <button onclick="showPricing('${event.name}')">Show Pricing</button>
            `;

            eventsSection.appendChild(eventCard);
        });
    } else {
        eventsSection.innerHTML = '<p>No results found</p>';
    }
}

window.onload = function() {
    loadEvents();
};
