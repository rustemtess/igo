import { IMessages } from "./interfaces/ICommandHandler.js";
import { readFileSync } from "fs";

export function cleanPhoneNumber(phoneNumber: string): string {
    // Пример: убираем все символы, кроме цифр
    return phoneNumber.replace(/\D/g, '');
}

export function isValidNumber(phoneNumber: string): boolean {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if(phoneNumber.length === 11) return true;
    return false;
}

export function pasteText(path: string, lang: string, n: number, arg?: Array<Array<string|number>>): string {
    const Message: IMessages = 
        JSON.parse(readFileSync('./production/' + path, 'utf-8'));

    let obj: string;
    if (lang === 'kz') {
        if (!Message.kz || !Message.kz[n]) {
            return '';
        }
        obj = Message.kz[n].toString();
    } else {
        if (!Message.ru || !Message.ru[n]) {
            return '';
        }
        obj = Message.ru[n].toString();
    }

    if (!arg) return obj;

    for (const [alias, text] of arg) {
        if (alias === undefined || text === undefined) {
            continue;
        }
        obj = obj.replace(alias.toString(), text.toString());
    }

    return obj;
}