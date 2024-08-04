import { createConnection } from 'mysql';
import "dotenv/config";

// Создаем подключение к базе данных
export const connection = createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '' //iGo
});
