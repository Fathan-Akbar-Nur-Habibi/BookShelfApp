
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('book-form');
    const searchInput = document.getElementById('search');
    
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        return books;
    };

    const saveBooks = (books) => {
        localStorage.setItem('books', JSON.stringify(books));
    };

    const generateBookItem = (book) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <h4>${book.title}</h4>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>
            <p>Status: ${book.isComplete ? 'Completed' : 'Incomplete'}</p>
            <button onclick="toggleBookStatus(${book.id})">Toggle Status</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        `;
        return bookItem;
    };

    const renderBooks = (books) => {
        const incompleteBookshelf = document.querySelector('#incompleteBookshelfList .book-list');
        const completeBookshelf = document.querySelector('#completeBookshelfList .book-list');
        
        incompleteBookshelf.innerHTML = '';
        completeBookshelf.innerHTML = '';
        
        books.forEach(book => {
            const bookItem = generateBookItem(book);
            if (book.isComplete) {
                completeBookshelf.appendChild(bookItem);
            } else {
                incompleteBookshelf.appendChild(bookItem);
            }
        });
    };

    const addBook = (title, author, year, isComplete) => {
        const books = loadBooks();
        const newBook = {
            id: new Date().getTime(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };
        books.push(newBook);
        saveBooks(books);
        renderBooks(books);
    };

    const toggleBookStatus = (id) => {
        const books = loadBooks();
        const bookIndex = books.findIndex(book => book.id === id);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            saveBooks(books);
            renderBooks(books);
        }
    };

    const deleteBook = (id) => {
        const books = loadBooks();
        const filteredBooks = books.filter(book => book.id !== id);
        saveBooks(filteredBooks);
        renderBooks(filteredBooks);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const isComplete = document.getElementById('isComplete').checked;
        
        addBook(title, author, year, isComplete);
        
        form.reset();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const books = loadBooks();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    });

    // Initialize
    renderBooks(loadBooks());
    
    // Expose functions to global scope for buttons
    window.toggleBookStatus = toggleBookStatus;
    window.deleteBook = deleteBook;
});
