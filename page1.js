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
    
    console.log("Load and display data for:", field);
    newParamField=field

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

function test() {
    console.log("Selected field:", newParamField);
    const cardsContainer = document.querySelector('.cards1');
    cardsContainer.innerHTML = '';  // Clear existing content

    let matchingEntries = db.filter(person => person.field === newParamField);

    matchingEntries.sort((a, b) => {
        const nameA = a.name ? a.name.toUpperCase() : '';
        const nameB = b.name ? b.name.toUpperCase() : '';
        return nameA.localeCompare(nameB);
    });

    if (matchingEntries.length === 0) {
        cardsContainer.innerHTML = `<p>No entries found for the field: ${newParamField}</p>`;
        return;
    }

    matchingEntries.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card';
        const websiteLink = formatLink(person.linkToSite);
        card.innerHTML = `
            <h3>${person.name || 'No Name Provided'}</h3>
          
            <h4> ${person.business || 'No Business'}</h4>
            
            <p >${person.description || 'No Description'}</p>
            <div class='div-icons'> 
            ${
                person.mail ? `<p> <a href="mailto:${person.mail}"><img class='small-icon' src='images/mail.svg' alt='Email'></a></p>` : ''
            }
            <p> ${
                websiteLink !== "No Website" 
                ? `<a href="${websiteLink}" target="_blank"><img class='small-icon' src='images/site.svg'></a>`
                : ''
            }</p>
            </div>
         
            <p style="font-size: 1.5em;"> ${
                person.phone ? `<a href="tel:${person.phone}">${person.phone}</a>` : 'No Phone'
            }</p>
        `;
        cardsContainer.appendChild(card);
    });

    let serviseTitle = document.getElementById('serviseTitle');
    serviseTitle.innerHTML=newParamField;
}

function formatLink(url) {
    if (!url) return "No Website";
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `http://${url}`;
    }
    return url;
}
