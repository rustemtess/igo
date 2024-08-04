import { IConnectionQuery } from "../interfaces/ICommandHandler.js";
import { ISqlOptions } from "../interfaces/ISql.js";
import { promisify } from "util";

export async function update(connection: IConnectionQuery, updateOptions: ISqlOptions): Promise<void> {
    try {
        const setClause: string = updateOptions.keys.map( key => `${key} = ?`).join(', ');
        const values: Array<string|number> = [...updateOptions.values, connection.user_id];
        const sql: string = `UPDATE ${updateOptions.table} SET ${setClause} WHERE user_id = ?`;
        const query: Function = promisify(connection.connection.query).bind(connection.connection);
        await query(sql, values);
    }catch(err) {
        throw err;
    }
}

export async function insert(connection: IConnectionQuery, insertOptions: ISqlOptions): Promise<void> {
    try {
        const columns = insertOptions.keys.join(', ')
        const placeholders = insertOptions.keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${insertOptions.table} (${columns}) VALUES (${placeholders})`;
        const query: Function = promisify(connection.connection.query).bind(connection.connection);
        await query(sql, insertOptions.values);
    }catch(err) {
        throw err;
    }
}

export async function deleteFromDB(connection: IConnectionQuery, deleteOptions: ISqlOptions): Promise<boolean> {
    try {
        const setClause: string = deleteOptions.keys.map(key => `${key} = ?`).join(' AND ');
        const sql: string = `DELETE FROM ${deleteOptions.table} WHERE ${setClause}`;
        const query: Function = promisify(connection.connection.query).bind(connection.connection);
        const result: any = await query(sql, deleteOptions.values);

        return await result.affectedRows > 0;
    } catch (err) {
        throw err;
    }
}
