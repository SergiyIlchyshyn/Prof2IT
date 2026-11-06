const DB_NAME = "LibraryDB";
const DB_VERSION = 1;
let db = null;

// Канал для миттєвої міжтабової синхронізації змін
const syncChannel = new BroadcastChannel("library_sync_channel");

export let appData = { books: [], readers: [], loans: [] };

// Завантаження даних з JSON файлу
async function fetchtData() {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("Не вдалося завантажити data.json");
        return await response.json();
    } catch (error) {
        console.error("Помилка завантаження JSON:", error);
        return { books: [], readers: [], loans: [] };
    }
}

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
            console.error("Помилка відкриття IndexedDB:", event.target.error);
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

// Завантаження даних із бази або з JSON
export async function loadAllData() {
    appData.books = await getAllFromStore("books");
    appData.readers = await getAllFromStore("readers");
    appData.loans = await getAllFromStore("loans");

    if (appData.books.length === 0 && appData.readers.length === 0 && appData.loans.length === 0) {
        const libraryData = await fetchtData();
        
        for (let b of libraryData.books) await putToStore("books", b);
        for (let r of libraryData.readers) await putToStore("readers", r);
        for (let l of libraryData.loans) await putToStore("loans", l);

        appData.books = libraryData.books;
        appData.readers = libraryData.readers;
        appData.loans = libraryData.loans;
    }
}

// Синхронізація між відкритими вкладками
export function notifyOtherTabs() {
    syncChannel.postMessage("data_updated");
}

export function subscribeToSync(callback) {
    syncChannel.onmessage = function (event) {
        if (event.data === "data_updated") callback();
    };
}