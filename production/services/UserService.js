var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promisify } from "util";
export function create(connection, number) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = promisify(connection.query).bind(connection);
            yield query("INSERT INTO `users`(`user_number`) VALUES (?)", [number]);
            console.log(`User ${number} added!`);
        }
        catch (err) {
            console.error(`Failed to add user ${number}:`, err);
            throw err;
        }
    });
}
export function get(connection, number) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = promisify(connection.query).bind(connection);
            const rows = yield query("SELECT * FROM `users` WHERE user_number = ?", [number]);
            console.log('User get rows', rows[0]);
            return rows[0];
        }
        catch (err) {
            throw err;
        }
    });
}
