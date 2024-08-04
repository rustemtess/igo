import { update, deleteFromDB } from "../../services/SqlService.js";
export function OrderDelete(connection, user_id) {
    update(connection, {
        table: 'users',
        keys: ['user_command'],
        values: ['menu']
    });
    deleteFromDB(connection, {
        table: 'orders',
        keys: ['user_id'],
        values: [user_id]
    });
}
