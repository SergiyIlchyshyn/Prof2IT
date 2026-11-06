import { appData } from "./db.js";

// Перемикання між табами
export function initTabs() {
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

// Генерація ID
export function getNextId(list, minId = 1) {
    if (!list || list.length === 0) return minId;
    const ids = list.map(item => parseInt(item.id, 10) || 0);
    return Math.max(...ids) + 1;
}

// Відкриття модалки
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === "bookModal") {
        document.getElementById("bookId").value = getNextId(appData.books, 1);
    } else if (modalId === "readerModal") {
        document.getElementById("readerId").value = getNextId(appData.readers, 1);
    } else if (modalId === "loanModal") {
        document.getElementById("loanId").value = getNextId(appData.loans, 101);
    }

    modal.style.display = "flex";
}

// Закриття модалок
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

export function showErrorPopup(message) {
    document.getElementById("errorMessageText").textContent = message;
    openModal("errorModal");
}