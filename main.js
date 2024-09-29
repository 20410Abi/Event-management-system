// Show specific section when clicked in the navbar
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Display the clicked section
    document.getElementById(sectionId).style.display = 'block';
}

// Create Event Functionality
function createNewEvent() {
    console.log('createEvent called')
    const name = document.getElementById('createName').value;
    const date = document.getElementById('createDate').value;
    const location = document.getElementById('createLocation').value;

    const freePrice = document.getElementById('priceFree').value;
    const advancedPrice = document.getElementById('priceAdvanced').value;
    const proPrice = document.getElementById('pricePro').value;

    if (name && date && location && freePrice && advancedPrice && proPrice) {
        // Get current events from local storage
        let events = JSON.parse(localStorage.getItem('events')) || [];

        // Check if the event name is unique
        if (events.some(event => event.name === name)) {
            alert('Event with this name already exists. Please use a unique name.');
            return;
        }

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

        // Add new event to the list of events
        events.push(newEvent);

        // Save back to local storage
        localStorage.setItem('events', JSON.stringify(events));

        alert(`Event Created: ${name} on ${date}`);

        // Clear form fields after submission
        document.getElementById('createName').value = '';
        document.getElementById('createDate').value = '';
        document.getElementById('createLocation').value = '';
        document.getElementById('priceFree').value = '';
        document.getElementById('priceAdvanced').value = '';
        document.getElementById('pricePro').value = '';

    } else {
        alert('Please provide valid event details.');
    }
}


// Edit Event Functionality
function editEvent() {
    const name = document.getElementById('editName').value;
    const date = document.getElementById('editDate').value;
    const location = document.getElementById('editLocation').value;

    const freePrice = document.getElementById('editPriceFree').value;
    const advancedPrice = document.getElementById('editPriceAdvanced').value;
    const proPrice = document.getElementById('editPricePro').value;

    // Get the existing events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Find the event by the current name
    let eventIndex = events.findIndex(event => event.name === name);

    if (eventIndex !== -1) {
        // Check if all new fields are valid
        if (name && date && location && freePrice && advancedPrice && proPrice) {
            // Update the event details
            events[eventIndex] = {
                name: name,
                date: date,
                location: location,
                pricing: {
                    free: parseFloat(freePrice),
                    advanced: parseFloat(advancedPrice),
                    pro: parseFloat(proPrice)
                }
            };

            // Save the updated events back to local storage
            localStorage.setItem('events', JSON.stringify(events));

            alert(`Event Updated: ${name} on ${date}`);

            // Clear form fields after submission
            document.getElementById('editName').value = '';
            document.getElementById('editDate').value = '';
            document.getElementById('editLocation').value = '';
            document.getElementById('editPriceFree').value = '';
            document.getElementById('editPriceAdvanced').value = '';
            document.getElementById('editPricePro').value = '';

        } else {
            alert('Please provide valid event details.');
        }
    } else {
        alert('Event not found. Please provide a valid event name.');
    }
}


// Delete Event Functionality
function deleteEvent() {
    const name = document.getElementById('deleteName').value;

    if (name) {
        // Get current events from local storage
        let events = JSON.parse(localStorage.getItem('events')) || [];

        // Find the index of the event to delete
        const eventIndex = events.findIndex(event => event.name === name);

        if (eventIndex !== -1) {
            // Remove the event from the array
            events.splice(eventIndex, 1);

            // Save the updated events back to local storage
            localStorage.setItem('events', JSON.stringify(events));

            alert(`Event Deleted: ${name}`);

            // Clear the input field
            document.getElementById('deleteName').value = '';
        } else {
            alert('Event not found. Please provide a valid event name.');
        }
    } else {
        alert('Please provide a valid event name.');
    }
}

// Function to load events from localStorage and display them as cards
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];

    const eventsSection = document.getElementById('eventsSection');
    eventsSection.innerHTML = ''; // Clear previous content

    if (events.length > 0) {
        // Loop through each event and create cards
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

// Function to display pricing for the selected event
function showPricing(eventName) {
    // Fetch events from localStorage
    const events = JSON.parse(localStorage.getItem('events')) || [];

    // Find the selected event by name
    const event = events.find(e => e.name === eventName);

    if (event) {
        // Update the pricing section with the event prices
        document.getElementById('basicPrice').textContent = `$${event.pricing.free}`;
        document.getElementById('advancedPrice').textContent = `$${event.pricing.advanced}`;
        document.getElementById('proPrice').textContent = `$${event.pricing.pro}`;

        // Show the pricing section
        document.getElementById('pricingSection').style.display = 'block';

        // Remove highlighted class from all cards
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            card.classList.remove('highlighted');
        });

        // Add highlighted class to the clicked card
        const clickedCard = document.querySelector(`.event-card button[onclick="showPricing('${eventName}')"]`).parentElement;
        clickedCard.classList.add('highlighted');
    }
}

// Function to filter and update events based on search input
function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase(); // Get the search query and convert to lowercase
    const events = JSON.parse(localStorage.getItem('events')) || []; // Get events from localStorage
    const eventsSection = document.getElementById('eventsSection'); // The section to display events

    // Clear the current content of the events section
    eventsSection.innerHTML = '';

    // Filter events by name or location
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)
    );

    // Check if there are any matching events
    if (filteredEvents.length > 0) {
        // Loop through each filtered event and display them
        filteredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p>Location: ${event.location}</p>
                <button onclick="showPricing('${event.name}')">Show Pricing</button>
            `;
            eventsSection.appendChild(eventCard); // Append the event card to the section
        });
    } else {
        // If no events match, display a "No results found" message
        eventsSection.innerHTML = '<p>No results found</p>';
    }
}

// Function to generate dummy events if none exist in localStorage
function createDummyEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];

    if (events.length === 0) {
        const dummyEvents = [];
        const locations = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami'];

        for (let i = 1; i <= 5; i++) {
            const event = {
                name: `Event ${i}`,
                date: `2024-10-${i < 10 ? '0' + i : i}`,
                location: locations[i - 1],
                pricing: {
                    free: i * 10,
                    advanced: i * 20,
                    pro: i * 30
                }
            };
            dummyEvents.push(event);
        }

        localStorage.setItem('events', JSON.stringify(dummyEvents));

        console.log('5 dummy events created and added to localStorage.');
    } else {
        console.log('Events already exist in localStorage.');
    }
}

window.onload = function() {
    createDummyEvents();
    loadEvents();
};

