export function formatPhoneNumber(value) {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("380")) digits = digits.substring(3);
    else if (digits.startsWith("80")) digits = digits.substring(2);
    else if (digits.startsWith("0")) digits = digits.substring(1);

    digits = digits.substring(0, 9);
    let result = "+380";

    if (digits.length > 0) result += " (" + digits.substring(0, 2);
    if (digits.length >= 2) result += ") ";
    if (digits.length > 2) result += digits.substring(2, 5);
    if (digits.length >= 5) result += "-";
    if (digits.length > 5) result += digits.substring(5, 7);
    if (digits.length >= 7) result += "-";
    if (digits.length > 7) result += digits.substring(7, 9);

    return result;
}

export function validateFieldValue(field, value) {
    const val = value ? value.trim() : "";

    if (!val && field !== "factDate") return "Поле не може бути порожнім!";

    switch (field) {
        case "name":
        case "author":
            if (!/^[A-Za-zА-Яа-яІіЇїЄєҐґ'’\s-]{2,60}$/.test(val)) {
                return "Введіть коректне ім'я/ПІБ (літери, пробіли, дефіс, апостроф).";
            }
            break;

        case "card":
            if (!/^LIB-\d{4}-\d{3,}$/i.test(val)) {
                return "Формат квитка має бути: LIB-2026-001";
            }
            break;

        case "phone":
            const cleanPhone = val.replace(/[\s\(\)\-]/g, "");
            if (!/^\+?380\d{9}$/.test(cleanPhone)) {
                return "Формат телефону має бути: +380 (XX) XXX-XX-XX";
            }
            break;

        case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                return "Введіть коректну email-адресу.";
            }
            break;

        case "year":
            const yearNum = Number(val);
            const currentYear = new Date().getFullYear();
            if (isNaN(yearNum) || yearNum < 1000 || yearNum > currentYear) {
                return `Рік видання має бути в межах від 1000 до ${currentYear}.`;
            }
            break;

        case "pages":
            if (isNaN(Number(val)) || Number(val) <= 0) return "Кількість сторінок має бути більшою за 0.";
            break;

        case "stock":
            if (isNaN(Number(val)) || Number(val) < 0) return "Кількість у наявності не може бути від'ємною.";
            break;
    }

    return null;
}