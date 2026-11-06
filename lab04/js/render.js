import { appData } from "./db.js";

export function renderAllTables() {
    renderBooks();
    renderReaders();
    renderLoans();
}

function renderBooks() {
    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";
    appData.books.forEach(b => {
        const stockNum = parseInt(b.stock, 10) || 0;
        const stockText = stockNum > 0 ? `Так (${stockNum} шт.)` : "Ні (розібрано)";
        const tr = document.createElement("tr");
        tr.dataset.id = b.id;
        tr.innerHTML = `
            <td>${b.id}</td>
            <td class="editable" data-field="title">${b.title}</td>
            <td class="editable" data-field="author">${b.author}</td>
            <td class="editable" data-field="year">${b.year}</td>
            <td class="editable" data-field="genre">${b.genre}</td>
            <td class="editable" data-field="pages">${b.pages}</td>
            <td class="editable" data-field="stock">${stockText}</td>
            <td class="actions-cell"><button class="delete-btn" title="Видалити">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderReaders() {
    const tbody = document.querySelector("#readersTable tbody");
    tbody.innerHTML = "";
    appData.readers.forEach(r => {
        const tr = document.createElement("tr");
        tr.dataset.id = r.id;
        tr.innerHTML = `
            <td>${r.id}</td>
            <td class="editable" data-field="name">${r.name}</td>
            <td class="editable" data-field="card">${r.card}</td>
            <td class="editable" data-field="birthday">${r.birthday}</td>
            <td class="editable" data-field="phone">${r.phone}</td>
            <td class="editable" data-field="email">${r.email}</td>
            <td class="editable" data-field="active">${r.active}</td>
            <td class="actions-cell"><button class="delete-btn" title="Видалити">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLoans() {
    const tbody = document.querySelector("#loansTable tbody");
    tbody.innerHTML = "";
    appData.loans.forEach(l => {
        const tr = document.createElement("tr");
        tr.dataset.id = l.id;
        tr.innerHTML = `
            <td>${l.id}</td>
            <td class="editable" data-field="book" data-type="select-book">${l.book}</td>
            <td class="editable" data-field="reader" data-type="select-reader">${l.reader}</td>
            <td class="editable" data-field="date">${l.date}</td>
            <td class="editable" data-field="planDate">${l.planDate}</td>
            <td class="editable" data-field="factDate">${l.factDate}</td>
            <td class="editable" data-field="status" data-type="select-status">${l.status}</td>
            <td class="actions-cell"><button class="delete-btn" title="Видалити">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });
}

export function populateLoanSelects() {
    const bookSelect = document.getElementById("loanBookSelect");
    const readerSelect = document.getElementById("loanReaderSelect");

    bookSelect.innerHTML = "";
    readerSelect.innerHTML = "";

    if (appData.books.length === 0) {
        bookSelecdefaultDatat.innerHTML = `<option value="">(Немає доступних книг)</option>`;
    } else {
        appData.books.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.title;
            opt.textContent = `${b.title} (Автор: ${b.author})`;
            bookSelect.appendChild(opt);
        });
    }

    if (appData.readers.length === 0) {
        readerSelect.innerHTML = `<option value="">(Немає зареєстрованих читачів)</option>`;
    } else {
        appData.readers.forEach(r => {
            const opt = document.createElement("option");
            opt.value = r.name;
            opt.textContent = `${r.name} (${r.card})`;
            readerSelect.appendChild(opt);
        });
    }
}