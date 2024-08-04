import { Connection} from "mysql";
import { promisify } from "util";
import { IOrderData } from "../interfaces/IOrder";

export async function get(connection: Connection, user_id: number): Promise<IOrderData> {
    try {
        const query: Function = promisify(connection.query).bind(connection);
        const rows: IOrderData[] = await query("SELECT * FROM `orders` WHERE user_id = ?", [user_id]);
        console.log('Order get rows', rows[0])
        return rows[0];
    }catch(err) {
        throw err;
    }
}