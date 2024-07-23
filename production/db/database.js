var _a, _b, _c, _d;
import { createConnection } from 'mysql';
import "dotenv/config";
// Создаем подключение к базе данных
export const connection = createConnection({
    host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
    user: (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'root',
    password: (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : '',
    database: (_d = process.env.DB_DATABASE) !== null && _d !== void 0 ? _d : '' //iGo
});
