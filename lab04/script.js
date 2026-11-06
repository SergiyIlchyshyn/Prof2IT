const defaultData = {
    books: [
        { id: 1, title: "«Тіні забутих предків»", author: "Михайло Коцюбинський", year: "1911", genre: "Повість / Драматизм", pages: "160", stock: "3" },
        { id: 2, title: "«Захар Беркут»", author: "Іван Франко", year: "1883", genre: "Історична повість", pages: "224", stock: "2" },
        { id: 3, title: "«Кайдашева сім'я»", author: "Іван Нечуй-Левицький", year: "1879", genre: "Соціально-побутова повість", pages: "320", stock: "0" }
    ],
    readers: [
        { id: 1, name: "Шевченко Катерина Василівна", card: "LIB-2026-001", birthday: "15.05.1998", phone: "+380 (67) 111-22-33", email: "k.shevchenko@gmail.com", active: "1" },
        { id: 2, name: "Франко Максим Петрович", card: "LIB-2026-002", birthday: "22.11.2001", phone: "+380 (50) 444-55-66", email: "m.franko@ukr.net", active: "2" },
        { id: 3, name: "Костенко Оксана Іванівна", card: "LIB-2026-003", birthday: "03.09.1995", phone: "+380 (93) 777-88-99", email: "oksana.k@gmail.com", active: "0" }
    ],
    loans: [
        { id: 101, book: "«Тіні забутих предків»", reader: "Шевченко Катерина Василівна", date: "10.03.2026", planDate: "24.03.2026", factDate: "—", status: "На руках" },
        { id: 102, book: "«Захар Беркут»", reader: "Франко Максим Петрович", date: "01.03.2026", planDate: "15.03.2026", factDate: "12.03.2026", status: "Повернено" },
        { id: 103, book: "«Кайдашева сім'я»", reader: "Франко Максим Петрович", date: "05.03.2026", planDate: "19.03.2026", factDate: "—", status: "Протерміновано" }
    ]
};
let appData = { books: [], readers: [], loans: [] };

// Перемикання між табами
function openTab() {
    const tabButtons = document.querySelectorAll(".tab-button");

    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            let tabName = this.dataset.tab;
            let tabContent = document.getElementById(tabName);

            let allTabButtons = document.querySelectorAll(".tab-button");
            let allTabContents = document.querySelectorAll(".tab-content");

            allTabContents.forEach(content => {
                content.style.display = "none";
            });

            allTabButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            if (tabContent) {
                tabContent.style.display = "block";
            }
            this.classList.add("active");
        });
    });
    const firstTab = document.querySelector(".tab-button");
    if (firstTab) {
        firstTab.click();
    }
}
openTab();

// Генерація ID
function getNextId(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    if (rows.length === 0) return 1;
    const ids = Array.from(rows).map(row => parseInt(row.cells[0]?.textContent.trim(), 10) || 0);
    return Math.max(...ids) + 1;
}

// Відкриття модалки
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    console.log("Modal ID:", modalId);
    if (!modal) return;

    if (modalId === "bookModal") {
        document.getElementById("bookId").value = getNextId("booksTable");
    } else if (modalId === "readerModal") {
        document.getElementById("readerId").value = getNextId("readersTable");
    } else if (modalId === "loanModal") {
        const nextLoanId = getNextId("loansTable");
        document.getElementById("loanId").value = nextLoanId < 101 ? 101 : nextLoanId;
    }

    modal.style.display = "flex";
}
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", function () {
        openModal(this.dataset.modal);
    });
});
function showErrorPopup(message) {
    document.getElementById("errorMessageText").textContent = message;
    openModal("errorModal");
}
// Закриття модалок
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
const closeButtons = document.querySelectorAll(".close-btn");
closeButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        closeModal(this.dataset.modal);
    });
});
window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            modal.style.display = "none";
        });
    }
});
document.querySelector(".error-ok-btn").addEventListener("click", function() {
    closeModal("errorModal");
});
// +++++++++++++++
function canDeleteRow(row) {
    const table = row.closest("table");
    const tableId = table.id;

    if (tableId === "booksTable") {
        const bookTitle = row.cells[1].textContent.trim();
        const loanRows = document.querySelectorAll("#loansTable tbody tr");

        for (let lRow of loanRows) {
            const loanBook = lRow.cells[1].textContent.trim();
            const loanStatus = lRow.cells[6].textContent.trim();

            if (loanBook === bookTitle && loanStatus !== "Повернено") {
                showErrorPopup(`Неможливо видалити книгу "${bookTitle}", оскільки вона зараз видана читачу (Статус: ${loanStatus}).`);
                return false;
            }
        }
    } else if (tableId === "readersTable") {
        const readerName = row.cells[1].textContent.trim();
        const loanRows = document.querySelectorAll("#loansTable tbody tr");

        for (let lRow of loanRows) {
            const loanReader = lRow.cells[2].textContent.trim();
            const loanStatus = lRow.cells[6].textContent.trim();

            if (loanReader === readerName && loanStatus !== "Повернено") {
                showErrorPopup(`Неможливо видалити читача "${readerName}", оскільки за ним рахується неповернена книга.`);
                return false;
            }
        }
    }

    return true;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const row = e.target.closest("tr");
        if (canDeleteRow(row)) {
            row.remove();
        }
    }
});
// +++++++++++++++
document.addEventListener("click", (e) => {
    const cell = e.target.closest("td.editable");
    if (!cell || cell.classList.contains("editing")) return;

    cell.classList.add("editing");
    const currentValue = cell.textContent.trim();

    const wrapper = document.createElement("div");
    wrapper.className = "inline-edit-wrapper";

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue;
    input.className = "inline-input";

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "✓";

    wrapper.appendChild(input);
    wrapper.appendChild(saveBtn);

    cell.innerHTML = "";
    cell.appendChild(wrapper);
    input.focus();

    function finishEdit() {
        const newValue = input.value.trim();
        cell.classList.remove("editing");
        cell.textContent = newValue !== "" ? newValue : currentValue;
    }

    saveBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        finishEdit();
    });

    input.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
            finishEdit();
        } else if (evt.key === "Escape") {
            cell.classList.remove("editing");
            cell.textContent = currentValue;
        }
    });

    input.addEventListener("blur", (evt) => {
        if (evt.relatedTarget !== saveBtn) {
            finishEdit();
        }
    });
});
// +++++++++++++++
function formatDate(dateString) {
    if (!dateString) return "—";
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}
function createCell(text, isEditable = true, fieldName = "") {
    const td = document.createElement("td");
    td.textContent = text;
    if (isEditable) {
        td.classList.add("editable");
        td.setAttribute("data-field", fieldName);
    }
    return td;
}

function createActionsCell() {
    const td = document.createElement("td");
    td.className = "actions-cell";
    td.innerHTML = `<button class="delete-btn" title="Видалити">&times;</button>`;
    return td;
}
// +++++++++++++++
// Додавання книги
function addBook(event) {
    event.preventDefault();
    // const table = document.getElementById("booksTable").getElementsByTagName("tbody")[0];
    // const newRow = table.insertRow(table.rows.length);
    // newRow.innerHTML = `
    //     <td>${document.getElementById("bookId").value}</td>
    //     <td>${document.getElementById("bookTitle").value}</td>
    //     <td>${document.getElementById("bookAuthor").value}</td>
    //     <td>${document.getElementById("bookYear").value}</td>
    //     <td>${document.getElementById("bookGenre").value}</td>
    //     <td>${document.getElementById("bookPages").value}</td>
    //     <td>${document.getElementById("bookStock").value}</td>
    // `;
    const tbody = document.querySelector("#booksTable tbody");
    const stockCount = parseInt(document.getElementById("bookStock").value, 10);
    const stockText = stockCount > 0 ? `Так (${stockCount} шт.)` : "Ні (розібрано)";
    const row = document.createElement("tr");
    row.appendChild(createCell(document.getElementById("bookId").value, false));
    row.appendChild(createCell(`«${document.getElementById("bookTitle").value.replace(/«|»/g, "")}»`, true, "title"));
    row.appendChild(createCell(document.getElementById("bookAuthor").value, true, "author"));
    row.appendChild(createCell(document.getElementById("bookYear").value, true, "year"));
    row.appendChild(createCell(document.getElementById("bookGenre").value, true, "genre"));
    row.appendChild(createCell(document.getElementById("bookPages").value, true, "pages"));
    row.appendChild(createCell(stockText, true, "stock"));
    row.appendChild(createActionsCell());
    
    // document.getElementById("addBookForm").reset();
    tbody.appendChild(row);
    this.reset();
    closeModal("bookModal");
}
// +++++++++++++++
// Додавання читача
function addReader(event) {
    event.preventDefault();
    // const table = document.getElementById("readersTable").getElementsByTagName("tbody")[0];
    // const newRow = table.insertRow(table.rows.length);
    // newRow.innerHTML = `
    //     <td>${document.getElementById("readerId").value}</td>
    //     <td>${document.getElementById("readerName").value}</td>
    //     <td>${document.getElementById("readerCard").value}</td>
    //     <td>${document.getElementById("readerBirthday").value}</td>
    //     <td>${document.getElementById("readerPhone").value}</td>
    //     <td>${document.getElementById("readerEmail").value}</td>
    //     <td>${document.getElementById("readerActive").value}</td>
    // `;
    // document.getElementById("addReaderForm").reset();
    const tbody = document.querySelector("#readersTable tbody");

    const row = document.createElement("tr");
    row.appendChild(createCell(document.getElementById("readerId").value, false));
    row.appendChild(createCell(document.getElementById("readerName").value, true, "name"));
    row.appendChild(createCell(document.getElementById("readerCard").value, true, "card"));
    row.appendChild(createCell(formatDate(document.getElementById("readerBirthday").value), true, "birthday"));
    row.appendChild(createCell(document.getElementById("readerPhone").value, true, "phone"));
    row.appendChild(createCell(document.getElementById("readerEmail").value, true, "email"));
    row.appendChild(createCell(document.getElementById("readerActive").value, true, "active"));
    row.appendChild(createActionsCell());

    tbody.appendChild(row);
    this.reset();
    closeModal("readerModal");
}
// ++++++++++++++++
// Додавання нової видачі 
function addLoan(event) {
    event.preventDefault();
    // const table = document.getElementById("loansTable").getElementsByTagName("tbody")[0];
    // const newRow = table.insertRow(table.rows.length);
    // newRow.innerHTML = `
    //     <td>${document.getElementById("loanId").value}</td>
    //     <td>${document.getElementById("loanBook").value}</td>
    //     <td>${document.getElementById("loanReader").value}</td>
    //     <td>${document.getElementById("loanDate").value}</td>
    //     <td>${document.getElementById("loanPlanDate").value}</td>
    //     <td>${document.getElementById("loanFactDate").value}</td>
    //     <td>${document.getElementById("loanStatus").value}</td>
    // `;
    // document.getElementById("addLoanForm").reset();
    const tbody = document.querySelector("#loansTable tbody");

    const row = document.createElement("tr");
    row.appendChild(createCell(document.getElementById("loanId").value, false));
    row.appendChild(createCell(`«${document.getElementById("loanBook").value.replace(/«|»/g, "")}»`, true, "book"));
    row.appendChild(createCell(document.getElementById("loanReader").value, true, "reader"));
    row.appendChild(createCell(formatDate(document.getElementById("loanDate").value), true, "date"));
    row.appendChild(createCell(formatDate(document.getElementById("loanPlanDate").value), true, "planDate"));
    row.appendChild(createCell(formatDate(document.getElementById("loanFactDate").value), true, "factDate"));
    row.appendChild(createCell(document.getElementById("loanStatus").value, true, "status"));
    row.appendChild(createActionsCell());

    tbody.appendChild(row);
    this.reset();
    closeModal("loanModal");
}

// ++++++++++++++++
const addBookForm = document.getElementById("addBookForm");
addBookForm.addEventListener("submit", addBook);

const addReaderForm = document.getElementById("addReaderForm");
addReaderForm.addEventListener("submit", addReader);

const addLoanForm = document.getElementById("addLoanForm");
addLoanForm.addEventListener("submit", addLoan);