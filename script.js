document.getElementById('burger-toggle').addEventListener('click', function() {
    const menuContent = document.querySelector('.menu-content');
    menuContent.classList.toggle('hidden');
});
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="search"]');
    const cards = document.querySelectorAll('.card');
    const cardTitles = document.querySelectorAll('.card h3');

    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.toLowerCase();

        cardTitles.forEach((title, index) => {
            const card = cards[index];  // Corresponding card for each title
            const text = title.textContent.toLowerCase();
            if (text.includes(searchText)) {
                card.style.display = "";  // Show the card
            } else {
                card.style.display = "none";  // Hide the card
            }
        });
    });
});

   
    const searchInput = document.querySelector('input[type="search"]');
    const logo = document.querySelector('img.logo'); // Ensure the logo has the class 'logo'

    // Event when the search input is focused
    searchInput.addEventListener('focus', function() {
        logo.style.display = 'none'; // Hides the logo
       
    });

    // Event when the search input loses focus
    searchInput.addEventListener('blur', function() {
        logo.style.display = ''; // Restores the logo display
    });

