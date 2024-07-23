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
export function get(connection, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = promisify(connection.query).bind(connection);
            const rows = yield query("SELECT * FROM `drivers` WHERE user_id = ?", [user_id]);
            console.log('Driver get rows', rows[0]);
            return rows[0];
        }
        catch (err) {
            throw err;
        }
    });
}
