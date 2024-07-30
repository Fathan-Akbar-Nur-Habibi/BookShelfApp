document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('searchInput');

    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    });

    searchInput.addEventListener('input', () => {
        searchBook(searchInput.value);
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener('ondatasaved', () => {
    console.log('Data saved.');
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromBooks();
});

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;

    const generatedID = +new Date();
    const bookObject = composeBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event('ondatasaved'));
    updateDataToStorage();
    refreshDataFromBooks();
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Author: ${bookObject.author}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Year: ${bookObject.year}`;

    const container = document.createElement('div');
    container.classList.add('book-item');
    container.append(bookTitle, bookAuthor, bookYear);

    const moveButton = document.createElement('button');
    moveButton.innerText = bookObject.isComplete ? 'Mark as Unfinished' : 'Mark as Finished';
    moveButton.classList.add('move');
    moveButton.addEventListener('click', () => {
        moveBook(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteBook(bookObject.id);
    });

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => {
        editBook(bookObject.id);
    });

    container.append(moveButton, deleteButton, editButton);

    return container;
}

function refreshDataFromBooks() {
    const unfinishedBookList = document.getElementById('unfinishedBookList').querySelector('.books');
    const finishedBookList = document.getElementById('finishedBookList').querySelector('.books');

    unfinishedBookList.innerHTML = '';
    finishedBookList.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);
        if (!book.isComplete) {
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }
}

function moveBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = !bookTarget.isComplete;
    updateDataToStorage();
    refreshDataFromBooks();
}

function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    updateDataToStorage();
    refreshDataFromBooks();
}

function searchBook(query) {
    const lowerQuery = query.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(lowerQuery));
    displayFilteredBooks(filteredBooks);
}

function displayFilteredBooks(filteredBooks) {
    const unfinishedBookList = document.getElementById('unfinishedBookList').querySelector('.books');
    const finishedBookList = document.getElementById('finishedBookList').querySelector('.books');

    unfinishedBookList.innerHTML = '';
    finishedBookList.innerHTML = '';

    for (const book of filteredBooks) {
        const bookElement = makeBook(book);
        if (!book.isComplete) {
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }
}

function editBook(bookId) {
    const book = findBook(bookId);
    if (!book) return;

    const title = prompt('New Title:', book.title);
    const author = prompt('New Author:', book.author);
    const year = prompt('New Year:', book.year);
    const isComplete = confirm('Is it finished?');

    book.title = title;
    book.author = author;
    book.year = year;
    book.isComplete = isComplete;

    updateDataToStorage();
    refreshDataFromBooks();
}
