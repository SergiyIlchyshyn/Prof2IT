const libraryData = {
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

// --- Функції рендерингу (звертаються до єдиного об'єкта) ---
function renderBooks() {
    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";
    tbody.innerHTML = libraryData.books.map(book => {
        const stockCount = parseInt(book.stock, 10);
        const stockText = stockCount > 0 ? `Так (${stockCount} шт.)` : 'Ні (розібрано)';
        
        return `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.genre}</td>
                <td>${book.pages}</td>
                <td>${stockText}</td>
            </tr>
        `;
    }).join('');
}

function renderReaders() {
    const tbody = document.querySelector("#readersTable tbody");
    tbody.innerHTML = "";
    tbody.innerHTML = libraryData.readers.map(reader => `
        <tr>
            <td>${reader.id}</td>
            <td>${reader.name}</td>
            <td>${reader.card}</td>
            <td>${reader.birthday}</td>
            <td>${reader.phone}</td>
            <td>${reader.email}</td>
            <td>${reader.active}</td>
        </tr>
    `).join('');
}

function renderLoans() {
    const tbody = document.querySelector("#loansTable tbody");
    tbody.innerHTML = "";
    tbody.innerHTML = libraryData.loans.map(loan => `
        <tr>
            <td>${loan.id}</td>
            <td>${loan.book}</td>
            <td>${loan.reader}</td>
            <td>${loan.date}</td>
            <td>${loan.planDate}</td>
            <td>${loan.factDate}</td>
            <td>${loan.status}</td>
        </tr>
    `).join('');
}

function renderAll() {
    renderBooks();
    renderReaders();
    renderLoans();
}

function openTab() {
    const tabButtons = document.querySelectorAll(".tab-button");
    // console.log(tabButtons);

    tabButtons.forEach(function (button) {
    
        button.addEventListener("click", function () {
            let tabName = this.dataset.tab;
            console.log(tabName);
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

document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    openTab();
});