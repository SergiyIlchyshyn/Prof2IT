function openTab() {
    const tabButtons = document.querySelectorAll(".tab-button");
    // console.log(tabButtons);

    tabButtons.forEach(function (button) {
    
        button.addEventListener("click", function () {
            let tabName = this.dataset.tab;
            // console.log(tabName);
            let tabContent = document.getElementById(tabName);

            let allTabButtons = document.querySelectorAll(".tab-button");
            let allTabContent = document.querySelectorAll(".tab-content");

            allTabContent.forEach(content => {
                content.style.display = "none";
            });

            allTabButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            tabContent.style.display = "block";
            this.classList.add("active");
        });
    });
    document.querySelector(".tab-button").click();
}

openTab();

// відкриття модалки
document.getElementById("addBookBtn").addEventListener("click", function () {
    const modal = document.getElementById("bookModal");
    modal.style.display = "flex";
});
// закриття модалки

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


document.getElementById("closeModal").addEventListener("click", function () {
    closeModal("bookModal");
});


function addBook(event) {
    event.preventDefault();
    const table = document.getElementById("booksTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();

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
const addBookForm = document.getElementById("addBookForm");
addBookForm.addEventListener("submit", addBook);