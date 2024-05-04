document.addEventListener('DOMContentLoaded', function() {
    // Initial data fetch and setup
    loadData().then(fieldCounts => {
        loadMainList(fieldCounts);
    });

    // Initialize search and logo functionality after the DOM is fully loaded
    initializeDynamicElements();
});

// Fetch and process Excel data
async function loadData() {
    try {
        const response = await fetch('db.xlsx');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        db = XLSX.utils.sheet_to_json(worksheet);
        return db.reduce(reduceFields, {});
    } catch (error) {
        console.error('Error loading the Excel file:', error);
        return {};
    }
}

// Reduce function to calculate field counts
function reduceFields(acc, person) {
    if (acc[person.field]) {
        acc[person.field]++;
    } else {
        acc[person.field] = 1;
    }
    return acc;
}

// Load and display the main list of cards
function loadMainList(fieldCounts) {
    // const page1 = document.getElementById('page1');
    // if (!page1.querySelector('.main')) {
    //     page1.innerHTML = "";
    // }

    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';

    Object.entries(fieldCounts).forEach(([field, count]) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${field}</h3>
            <p>מספר נותני שירות בתחום: ${count}</p>
         
        `;
        card.onclick = function() {
            moveToPage2(field);  
          
        };
        cardsContainer.appendChild(card);
    });
}

// Initialize dynamic elements (search bar and logo)
function initializeDynamicElements() {
    const searchInput = document.querySelector('input[type="search"]');
    const logo = document.getElementById('logo');

    searchInput.addEventListener('focus', function() {
        logo.style.display = 'none';
    });

    searchInput.addEventListener('blur', function() {
        logo.style.display = '';
        // searchInput.value=""
    });

    // Event listener for search bar input to filter cards
    searchInput.addEventListener('input', function() {
        filterCards(searchInput.value);
    });
}

// Filter cards based on search input
function filterCards(filterText) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const field = card.querySelector('h3').textContent;
        if (field.toLowerCase().includes(filterText.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
function moveToPage2(field){
    console.log("Selected field:", field);
    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';  // Clear existing content

    // Filter db for entries matching the specified field
    const matchingEntries = db.filter(person => person.field === field);

    // Check if matching entries exist
    if (matchingEntries.length === 0) {
        cardsContainer.innerHTML = `<p>No entries found for the field: ${field}</p>`;
        return;
    }

    // Create and append new cards for each matching entry
    matchingEntries.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${person.name}</h3>
            <p>Cell: ${person.cellPhone}</p>
            <p>Email: ${person.mail}</p>
            <p>Business: ${person.buisness}</p>
            <p>Field: ${person.field}</p>
            <p>Description: ${person.description}</p>
            <p>Website: <a href="${person.linkToSite}" target="_blank">${person.linkToSite}</a></p>
            <p>Phone: ${person.phone}</p>
        `;
        cardsContainer.appendChild(card);
    });
}
