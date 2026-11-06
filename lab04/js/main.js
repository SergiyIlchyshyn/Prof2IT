import { initDB, loadAllData, putToStore, deleteFromStore, notifyOtherTabs, subscribeToSync, appData } from "./db.js";
import { initTabs, openModal, closeModal, showErrorPopup, getNextId } from "./tabs.js";
import { renderAllTables, populateLoanSelects } from "./render.js";
import { formatPhoneNumber, validateFieldValue } from "./validators.js";

document.addEventListener("DOMContentLoaded", () => {
    initTabs();

    initDB().then(async () => {
        await loadAllData();
        renderAllTables();
    });

    subscribeToSync(async () => {
        await loadAllData();
        renderAllTables();
    });

    const phoneInput = document.getElementById("readerPhone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    }
    const addButtons = document.querySelectorAll(".add-btn");
    addButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            if (this.dataset.modal === "loanModal") {
                populateLoanSelects();
            }
            openModal(this.dataset.modal);
        });
    });
    const closeButtons = document.querySelectorAll(".close-btn");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", function() { 
            closeModal(this.dataset.modal); 
        });
    });

    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    });
    document.querySelector(".error-ok-btn").addEventListener("click", function() {
        closeModal("errorModal");
    });

    function canDeleteRow(tableId, id) {
        if (tableId === "booksTable") {
            const book = appData.books.find(b => b.id == id);
            if (book) {
                const activeLoan = appData.loans.find(l => l.book === book.title && l.status !== "Повернено");
                if (activeLoan) {
                    showErrorPopup(`Неможливо видалити книгу "${book.title}", оскільки вона знаходиться на руках.`);
                    return false;
                }
            }
        } else if (tableId === "readersTable") {
            const reader = appData.readers.find(r => r.id == id);
            if (reader) {
                const activeLoan = appData.loans.find(l => l.reader === reader.name && l.status !== "Повернено");
                if (activeLoan) {
                    showErrorPopup(`Неможливо видалити читача "${reader.name}", оскільки він має неповернену книгу.`);
                    return false;
                }
            }
        }
        return true;
    }

    document.addEventListener("click", async e => {
        if (e.target.classList.contains("delete-btn")) {
            const row = e.target.closest("tr");
            const tableId = row.closest("table").id;
            const id = row.dataset.id;

            if (canDeleteRow(tableId, id)) {
                let storeName = tableId === "booksTable" ? "books" : tableId === "readersTable" ? "readers" : "loans";
                await deleteFromStore(storeName, id);
                await loadAllData();
                renderAllTables();
                notifyOtherTabs();
            }
        }
    });

    document.addEventListener("click", e => {
        const cell = e.target.closest("td.editable");
        if (!cell || cell.classList.contains("editing")) return;

        cell.classList.add("editing");
        const row = cell.closest("tr");
        const tableId = row.closest("table").id;
        const rowId = row.dataset.id;
        const field = cell.dataset.field;
        const cellType = cell.dataset.type;
        const currentValue = cell.textContent.trim();

        const wrapper = document.createElement("div");
        wrapper.className = "inline-edit-wrapper";

        let inputElement;

        if (cellType === "select-book") {
            inputElement = document.createElement("select");
            inputElement.className = "inline-select";
            appData.books.forEach(b => {
                const opt = document.createElement("option");
                opt.value = b.title;
                opt.textContent = b.title;
                if (b.title === currentValue) opt.selected = true;
                inputElement.appendChild(opt);
            });
        } else if (cellType === "select-reader") {
            inputElement = document.createElement("select");
            inputElement.className = "inline-select";
            appData.readers.forEach(r => {
                const opt = document.createElement("option");
                opt.value = r.name;
                opt.textContent = r.name;
                if (r.name === currentValue) opt.selected = true;
                inputElement.appendChild(opt);
            });
        } else if (cellType === "select-status") {
            inputElement = document.createElement("select");
            inputElement.className = "inline-select";
            ["На руках", "Повернено", "Протерміновано"].forEach(st => {
                const opt = document.createElement("option");
                opt.value = st;
                opt.textContent = st;
                if (st === currentValue) opt.selected = true;
                inputElement.appendChild(opt);
            });
        } else {
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.value = currentValue;
            inputElement.className = "inline-input";

            if (field === "phone") {
                inputElement.addEventListener("input", (ev) => {
                    ev.target.value = formatPhoneNumber(ev.target.value);
                });
            }
        }

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.textContent = "✓";

        wrapper.appendChild(inputElement);
        wrapper.appendChild(saveBtn);
        cell.innerHTML = "";
        cell.appendChild(wrapper);
        inputElement.focus();

        async function finishEdit() {
            let newValue = inputElement.value.trim();

            const valError = validateFieldValue(field, newValue);
            if (valError) {
                showErrorPopup(valError);
                renderAllTables();
                return;
            }

            let storeName = tableId === "booksTable" ? "books" : tableId === "readersTable" ? "readers" : "loans";
            let list = appData[storeName];

            const item = list.find(i => i.id == rowId);
            if (item) {
                item[field] = newValue;
                await putToStore(storeName, item);
                await loadAllData();
                renderAllTables();
                notifyOtherTabs();
            }
        }

        saveBtn.addEventListener("click", evt => {
            evt.stopPropagation();
            finishEdit();
        });

        inputElement.addEventListener("keydown", evt => {
            if (evt.key === "Enter") finishEdit();
            else if (evt.key === "Escape") renderAllTables();
        });
    });

    function formatDate(dateString) {
        if (!dateString) return "—";
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    }

    document.getElementById("addBookForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;
        const year = document.getElementById("bookYear").value;

        const err = validateFieldValue("author", author) || validateFieldValue("year", year);
        if (err) { showErrorPopup(err); return; }

        const newBook = {
            id: getNextId(appData.books, 1),
            title: `«${title.replace(/«|»/g, "")}»`,
            author: author,
            year: year,
            genre: document.getElementById("bookGenre").value,
            pages: document.getElementById("bookPages").value,
            stock: document.getElementById("bookStock").value
        };
        await putToStore("books", newBook);
        await loadAllData();
        renderAllTables();
        notifyOtherTabs();
        this.reset();
        closeModal("bookModal");
    });

    document.getElementById("addReaderForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = document.getElementById("readerName").value;
        const card = document.getElementById("readerCard").value;
        const phone = document.getElementById("readerPhone").value;
        const email = document.getElementById("readerEmail").value;

        const err = validateFieldValue("name", name) || validateFieldValue("card", card) ||
                    validateFieldValue("phone", phone) || validateFieldValue("email", email);

        if (err) { showErrorPopup(err); return; }

        const newReader = {
            id: getNextId(appData.readers, 1),
            name: name,
            card: card,
            birthday: formatDate(document.getElementById("readerBirthday").value),
            phone: phone,
            email: email,
            active: document.getElementById("readerActive").value
        };
        await putToStore("readers", newReader);
        await loadAllData();
        renderAllTables();
        notifyOtherTabs();
        this.reset();
        closeModal("readerModal");
    });

    document.getElementById("addLoanForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const selectedBook = document.getElementById("loanBookSelect").value;
        const selectedReader = document.getElementById("loanReaderSelect").value;

        if (!selectedBook || !selectedReader) {
            showErrorPopup("Спочатку необхідно додати книгу та читача!");
            return;
        }

        const newLoan = {
            id: getNextId(appData.loans, 101),
            book: selectedBook,
            reader: selectedReader,
            date: formatDate(document.getElementById("loanDate").value),
            planDate: formatDate(document.getElementById("loanPlanDate").value),
            factDate: formatDate(document.getElementById("loanFactDate").value),
            status: document.getElementById("loanStatus").value
        };
        await putToStore("loans", newLoan);
        await loadAllData();
        renderAllTables();
        notifyOtherTabs();
        this.reset();
        closeModal("loanModal");
    });
});