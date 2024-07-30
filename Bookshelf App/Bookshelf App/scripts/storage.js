const STORAGE_KEY = 'BOOKSHELF_APP';

let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    if (serializedData !== null) {
        books = JSON.parse(serializedData);
    }

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if (isStorageExist()) {
        saveData();
    }
}

function composeBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for (const book of books) {
        if (book.id === bookId) {
            return index;
        }
        index++;
    }
    return -1;
}
