// Перемикання між табами
function openTab() {
    const tabButtons = document.querySelectorAll(".tab-button");

    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            let tabName = this.dataset.tab;
            let tabContent = document.getElementById(tabName);

            let allTabButtons = document.querySelectorAll(".tab-button");
            let allTabContent = document.querySelectorAll(".tab-content");

            allTabContent.forEach(content => {
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

// Відкриття модалки
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", function () {
        const modalId = this.dataset.modal; 
        if (modalId === "bookModal") {
            const tableRows = document.querySelectorAll("#booksTable tbody tr");
            document.getElementById("bookId").value = tableRows.length + 1;
        }
        openModal(modalId);
    });
});
// Закриття модалок
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
const closeButtons = document.querySelectorAll(".close-btn");
closeButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        const modalId = this.dataset.modal;
        closeModal(modalId);
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
// +++++++++++++++
// Додавання книги
function addBook(event) {
    event.preventDefault();
    const table = document.getElementById("booksTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow(table.rows.length);
    newRow.innerHTML = `
        <td>${document.getElementById("bookId").value}</td>
        <td>${document.getElementById("bookTitle").value}</td>
        <td>${document.getElementById("bookAuthor").value}</td>
        <td>${document.getElementById("bookYear").value}</td>
        <td>${document.getElementById("bookGenre").value}</td>
        <td>${document.getElementById("bookPages").value}</td>
        <td>${document.getElementById("bookStock").value}</td>
    `;
    document.getElementById("addBookForm").reset();
    closeModal("bookModal");
}
// +++++++++++++++
// Додавання читача
function addReader(event) {
    event.preventDefault();
    const table = document.getElementById("readersTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow(table.rows.length);
    newRow.innerHTML = `
        <td>${document.getElementById("readerId").value}</td>
        <td>${document.getElementById("readerName").value}</td>
        <td>${document.getElementById("readerCard").value}</td>
        <td>${document.getElementById("readerBirthday").value}</td>
        <td>${document.getElementById("readerPhone").value}</td>
        <td>${document.getElementById("readerEmail").value}</td>
        <td>${document.getElementById("readerActive").value}</td>
    `;
    document.getElementById("addReaderForm").reset();
    closeModal("readerModal");
}
// ++++++++++++++++
// Додавання нової видачі 
function addLoan(event) {
    event.preventDefault();
    const table = document.getElementById("loansTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow(table.rows.length);
    newRow.innerHTML = `
        <td>${document.getElementById("loanId").value}</td>
        <td>${document.getElementById("loanBook").value}</td>
        <td>${document.getElementById("loanReader").value}</td>
        <td>${document.getElementById("loanDate").value}</td>
        <td>${document.getElementById("loanPlanDate").value}</td>
        <td>${document.getElementById("loanFactDate").value}</td>
        <td>${document.getElementById("loanStatus").value}</td>
    `;
    document.getElementById("addLoanForm").reset();
    closeModal("loanModal");
}

// ++++++++++++++++
const addBookForm = document.getElementById("addBookForm");
addBookForm.addEventListener("submit", addBook);

const addReaderForm = document.getElementById("addReaderForm");
addReaderForm.addEventListener("submit", addReader);

const addLoanForm = document.getElementById("addLoanForm");
addLoanForm.addEventListener("submit", addLoan);