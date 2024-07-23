export function cleanPhoneNumber(phoneNumber) {
    // Пример: убираем все символы, кроме цифр
    return phoneNumber.replace(/\D/g, '');
}
export function isValidNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length === 11)
        return true;
    return false;
}
