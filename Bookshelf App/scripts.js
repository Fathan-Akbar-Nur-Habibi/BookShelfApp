// Function to generate a unique ID using timestamp
function generateId() {
    return new Date().getTime();
}

// Function to get books from localStorage
function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

// Function to save books to localStorage
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to render books
function renderBooks() {
    const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
    const completeBookshelf = document.getElementById('completeBookshelfList');
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';

    const books = getBooks();
    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelf.appendChild(bookElement);
        } else {
            incompleteBookshelf.appendChild(bookElement);
        }
    });
}

// Function to create a book element
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    const titleElement = document.createElement('h3');
    titleElement.setAttribute('data-testid', 'bookItemTitle');
    titleElement.textContent = book.title;
    bookElement.appendChild(titleElement);

    const authorElement = document.createElement('p');
    authorElement.setAttribute('data-testid', 'bookItemAuthor');
    authorElement.textContent = `Penulis: ${book.author}`;
    bookElement.appendChild(authorElement);

    const yearElement = document.createElement('p');
    yearElement.setAttribute('data-testid', 'bookItemYear');
    yearElement.textContent = `Tahun: ${book.year}`;
    bookElement.appendChild(yearElement);

    const buttonContainer = document.createElement('div');
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', () => toggleBookComplete(book.id));
    buttonContainer.appendChild(toggleButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    buttonContainer.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editBook(book.id));
    buttonContainer.appendChild(editButton);

    bookElement.appendChild(buttonContainer);

    return bookElement;
}

// Function to add a new book
function addBook(title, author, year, isComplete) {
    const books = getBooks();
    const newBook = {
        id: generateId(),
        title,
        author,
        year: Number(year),  // Ensure year is a number
        isComplete
    };
    books.push(newBook);
    saveBooks(books);
    renderBooks();
}

// Function to toggle book complete status
function toggleBookComplete(bookId) {
    const books = getBooks();
    const book = books.find(book => book.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks(books);
        renderBooks();
    }
}

// Function to delete a book
function deleteBook(bookId) {
    const books = getBooks();
    const updatedBooks = books.filter(book => book.id !== bookId);
    saveBooks(updatedBooks);
    renderBooks();
}

// Function to edit a book
function editBook(bookId) {
    const books = getBooks();
    const book = books.find(book => book.id === bookId);
    if (book) {
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year;
        document.getElementById('isComplete').checked = book.isComplete;

        deleteBook(bookId);
    }
}

// Function to search books
function searchBooks(query) {
    const books = getBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
    const completeBookshelf = document.getElementById('completeBookshelfList');
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelf.appendChild(bookElement);
        } else {
            incompleteBookshelf.appendChild(bookElement);
        }
    });
}

// Event listener for form submission
document.getElementById('bookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = Number(document.getElementById('year').value);  // Ensure year is a number
    const isComplete = document.getElementById('isComplete').checked;

    addBook(title, author, year, isComplete);
    this.reset();
});

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value;
    searchBooks(query);
});

// Initial render
document.addEventListener('DOMContentLoaded', renderBooks);
