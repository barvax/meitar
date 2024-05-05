let newParamField = ""

document.addEventListener('DOMContentLoaded', function() {
    // Create URLSearchParams object from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the 'field' parameter from the URL
    const field = urlParams.get('field');
    
    // Decode the URI component
    const decodedField = decodeURIComponent(field);

    // Now you can use this 'field' parameter to load data or any other purpose
    console.log("Field passed from previous page:", decodedField);
    
    // Assuming you have a function to handle data loading/displaying
    if (field) {
        loadDataAndDisplay(decodedField);
    }
});

function loadDataAndDisplay(field) {
    // Here you would implement the function that loads and displays the data
    // based on the 'field' value received from the previous page
    console.log("Load and display data for:", field);
    newParamField=field
    // Example:
    // fetch('data/source', { method: 'GET' })
    // .then(response => response.json())
    // .then(data => console.log(data));
}


async function loadData() {
    try {
        const response = await fetch('db.xlsx');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        db = XLSX.utils.sheet_to_json(worksheet);
        
        test()
    } catch (error) {
        console.error('Error loading the Excel file:', error);
        return {};
    }
    
}

function test(){
    console.log("Selected field:", newParamField);
    const cardsContainer = document.querySelector('.cards1');
    cardsContainer.innerHTML = '';  // Clear existing content

    const matchingEntries = db.filter(person => person.field=== newParamField);

    if (matchingEntries.length === 0) {
        cardsContainer.innerHTML = `<p>No entries found for the field: ${newParamField}</p>`;
        return;
    }

    matchingEntries.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${person.name || 'No Name Provided'}</h3>
            <p>Email: <a href="mailto:${person.mail || '#'}">${person.mail || 'No Email'}</a></p>
            <p>שם העסק: ${person.business || 'No Business'}</p>
            <p>תחום: ${person.field || 'No Field'}</p>
            <p>${person.description || 'No Description'}</p>
            <p>אתר: <a href="${formatLink(person.linkToSite)}" target="_blank">${formatLink(person.linkToSite)}</a></p>
            <p>טלפון: <a href="tel:${person.phone || '#'}">${person.phone || 'No Phone'}</a></p>
        `;
        cardsContainer.appendChild(card);
    });
    
}


function formatLink(url) {
   
    if (!url) {
        return '';
    }
  
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `http://${url}`;
    }
  
    return url;
}