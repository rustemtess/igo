import { Connection} from "mysql";
import { promisify } from "util";
import { IUserData } from "../interfaces/IUser.js";

export async function create(connection: Connection, number: string): Promise<void> {
    try{
        const query: Function = promisify(connection.query).bind(connection);
        await query("INSERT INTO `users`(`user_number`) VALUES (?)", [number]);
        console.log(`User ${number} added!`);
    }catch(err) {
        console.error(`Failed to add user ${number}:`, err);
        throw err;
    }
}

export async function get(connection: Connection, number: string): Promise<IUserData> {
    try {
        const query: Function = promisify(connection.query).bind(connection);
        const rows: IUserData[] = await query("SELECT * FROM `users` WHERE user_number = ?", [number]);
        console.log('User get rows', rows[0])
        return rows[0];
    }catch(err) {
        throw err;
    }
}