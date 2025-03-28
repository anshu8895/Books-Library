const apiUrl = 'https://api.freeapi.app/api/v1/public/books'; // Base API endpoint
let currentPage = 1; // Track the current page for pagination
const limit = 10; // Number of books per page

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
});

async function fetchBooks(query = '', page = 1) {
    try {
        const url = `${apiUrl}?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
        const result = await response.json();
        console.log(result); // Log the API response to inspect its structure

        // Extract the books array from the correct property
        const books = result.data.books || result.data.items || []; // Adjust based on actual structure
        displayBooks(books);

        // Handle pagination (if applicable)
        handlePagination(result.data);
    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}

function displayBooks(books) {
    if (!Array.isArray(books)) {
        console.error('Invalid books data:', books);
        return;
    }

    const bookContainer = document.getElementById('book-container');
    bookContainer.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${book.thumbnail || 'placeholder.jpg'}" alt="${book.title || 'No Title'}" class="book-thumbnail">
            <h3>${book.title || 'No Title'}</h3>
            <p>Author: ${book.author || 'Unknown'}</p>
            <p>Publisher: ${book.publisher || 'Unknown'}</p>
            <p>Published: ${book.publishedDate || 'N/A'}</p>
            <a href="${book.infoLink || '#'}" target="_blank" class="book-link">More Info</a>
        `;
        bookContainer.appendChild(bookCard);
    });
}

function handlePagination(data) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (data.previousPage) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchBooks('', currentPage);
        });
        paginationContainer.appendChild(prevButton);
    }

    if (data.nextPage) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            fetchBooks('', currentPage);
        });
        paginationContainer.appendChild(nextButton);
    }
}

// Add search functionality
document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    fetchBooks(searchTerm, 1); // Fetch books based on the search term
});

// Add sorting functionality
document.getElementById('sort-select').addEventListener('change', (event) => {
    const sortBy = event.target.value;
    const bookContainer = document.getElementById('book-container');
    const books = Array.from(bookContainer.children);

    books.sort((a, b) => {
        const titleA = a.querySelector('h3').textContent;
        const titleB = b.querySelector('h3').textContent;

        if (sortBy === 'asc') {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });

    bookContainer.innerHTML = '';
    books.forEach(book => bookContainer.appendChild(book));
});