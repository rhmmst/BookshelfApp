const books = [];
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APP';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


function addBook() {
    const bookTitle = document.getElementById('title').value;
    const bookWriter = document.getElementById('writer').value;
    const bookYear = document.getElementById('year').value;
    const bookRead = document.getElementById('read-switch');

    const generatedId = generateId();

    if (bookRead.checked) {
        const bookObject = generateBookObject(generatedId, bookTitle, bookWriter, bookYear, true);
        books.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedId, bookTitle, bookWriter, bookYear, false);
        books.push(bookObject);
    }
    
    

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
  }

function generateBookObject(id, title, writer, year, isRead) {
    return {
        id: id, 
        title: title, 
        writer: writer, 
        year: Number(year), 
        isRead: isRead
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const unfinishedBookList = document.getElementById('unfinished');
    unfinishedBookList.innerHTML = '';

    const finishedBookList = document.getElementById('finished');
    finishedBookList.innerHTML = '';


    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);   
        if (!bookItem.isRead) {
            unfinishedBookList.append(bookElement);
        } else{finishedBookList.append(bookElement)};
    }
});

function makeBook(bookObject) {

    const textTitle = document.createElement('div');
    textTitle.setAttribute('class', 'book-title');
    textTitle.innerText = bookObject.title;

    const textYear = document.createElement('span');
    textYear.setAttribute('class', 'year')
    textYear.innerText = ' | ' + bookObject.year;
    
    const textWriter = document.createElement('div');
    textWriter.setAttribute('class', 'book-caption')
    textWriter.innerText = bookObject.writer;
    textWriter.append(textYear);
    
    const container = document.createElement('div');
    container.append(textTitle, textWriter);
    container.setAttribute('class', 'item-container');
    const wraper = document.createElement('div');
    wraper.setAttribute('class', 'item-box');
    wraper.setAttribute('id', `book-${bookObject.id}`);
    wraper.append(container);

    if (bookObject.isRead) {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
            uncheckBookFromFinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button')

        trashButton.addEventListener('click', function () {
            removeBookFromFinished(bookObject.id);
        });


        const actionContainer = document.createElement('div');
        actionContainer.setAttribute('class', 'action-container');
        actionContainer.append(checkButton, trashButton);
        wraper.append(actionContainer);
    } else {
        const uncheckButton = document.createElement('button');
        uncheckButton.classList.add('uncheck-button');

        uncheckButton.addEventListener('click', function () {
            checkBookFromFinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button')

        trashButton.addEventListener('click', function () {
            removeBookFromFinished(bookObject.id);
        });


        const actionContainer = document.createElement('div');
        actionContainer.setAttribute('class', 'action-container');
        actionContainer.append(uncheckButton, trashButton);
        wraper.append(actionContainer);
    }

    function checkBookFromFinished (bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isRead = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (const bookItem of books) {
            if (bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function removeBookFromFinished(bookId) {
        const bookTarget = findBook(bookId);
        
        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function uncheckBookFromFinished(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isRead = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    return wraper;
}

const searchSubmit = document.getElementById('search-form');
searchSubmit.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const searchValue = document.getElementById('search').value.toLowerCase();
    const bookElements = document.querySelectorAll('.book-title');

    for(const bookElement of bookElements) {
        titleText = bookElement.innerText.toLowerCase();
        if (searchValue !== "") {
            if (titleText.includes(searchValue)) {
            
            } else {
                bookElement.parentElement.parentElement.style.display = "none";
            }
        } else {
            bookElement.parentElement.parentElement.style.display = "flex";
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function isStorageExist() {
    if(typeof(storage) === undefined) {
        alert('Your browser does not support Local Storage');
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    let getBook = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (getBook !== null) {
        for (const book of getBook) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}