const DB_NAME = "LibraryDB";
const DB_VERSION = 1;
let db = null;

const syncChannel = new BroadcastChannel("library_sync_channel");

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

export let appData = { books: [], readers: [], loans: [] };

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("books")) {
                db.createObjectStore("books", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("readers")) {
                db.createObjectStore("readers", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("loans")) {
                db.createObjectStore("loans", { keyPath: "id" });
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

export function getAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function putToStore(storeName, item) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function deleteFromStore(storeName, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.delete(Number(id));
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function loadAllData() {
    appData.books = await getAllFromStore("books");
    appData.readers = await getAllFromStore("readers");
    appData.loans = await getAllFromStore("loans");

    if (appData.books.length === 0 && appData.readers.length === 0 && appData.loans.length === 0) {
        for (let b of libraryData.books) await putToStore("books", b);
        for (let r of libraryData.readers) await putToStore("readers", r);
        for (let l of libraryData.loans) await putToStore("loans", l);

        appData.books = [...libraryData.books];
        appData.readers = [...libraryData.readers];
        appData.loans = [...libraryData.loans];
    }
}

export function notifyOtherTabs() {
    syncChannel.postMessage("data_updated");
}

export function subscribeToSync(callback) {
    syncChannel.onmessage = function (event) {
        if (event.data === "data_updated") callback();
    };
}