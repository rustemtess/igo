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
export function update(connection, updateOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const setClause = updateOptions.keys.map(key => `${key} = ?`).join(', ');
            const values = [...updateOptions.values, connection.user_id];
            const sql = `UPDATE ${updateOptions.table} SET ${setClause} WHERE user_id = ?`;
            const query = promisify(connection.connection.query).bind(connection.connection);
            yield query(sql, values);
        }
        catch (err) {
            throw err;
        }
    });
}
export function insert(connection, insertOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const columns = insertOptions.keys.join(', ');
            const placeholders = insertOptions.keys.map(() => '?').join(', ');
            const sql = `INSERT INTO ${insertOptions.table} (${columns}) VALUES (${placeholders})`;
            const query = promisify(connection.connection.query).bind(connection.connection);
            yield query(sql, insertOptions.values);
        }
        catch (err) {
            throw err;
        }
    });
}
export function deleteFromDB(connection, deleteOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const setClause = deleteOptions.keys.map(key => `${key} = ?`).join(' AND ');
            const sql = `DELETE FROM ${deleteOptions.table} WHERE ${setClause}`;
            const query = promisify(connection.connection.query).bind(connection.connection);
            yield query(sql, deleteOptions.values);
        }
        catch (err) {
            throw err;
        }
    });
}
