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




function loadMainList(fieldCounts) {
    

    const cardsContainer = document.querySelector('.cards');
    if(cardsContainer!==null){
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
  


}

// Initialize dynamic elements (search bar and logo)
function initializeDynamicElements() {
    const searchInput = document.querySelector('input[type="search"]');
    const logo = document.getElementById('logo');
    if(searchInput!==null){
      
    
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


function moveToPage2(field) {
    GLOBALFIELD=field
    console.log(GLOBALFIELD)
   window.location.href = `index1.html?field=${encodeURIComponent(field)}`;

    
}

