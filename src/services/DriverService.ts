import { Connection} from "mysql";
import { promisify } from "util";
import { IDriverData } from "../interfaces/IDriver";

export async function get(connection: Connection, user_id: number): Promise<IDriverData> {
    try {
        const query: Function = promisify(connection.query).bind(connection);
        const rows: IDriverData[] = await query("SELECT * FROM `drivers` WHERE user_id = ?", [user_id]);
        console.log('Driver get rows', rows[0])
        return rows[0];
    }catch(err) {
        throw err;
    }
}