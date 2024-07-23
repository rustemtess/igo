import { update, deleteFromDB } from "../../services/SqlService.js";
export function DriverDelete(connection, user_id) {
    update(connection, {
        table: 'users',
        keys: ['user_command'],
        values: ['menu']
    });
    deleteFromDB(connection, {
        table: 'drivers',
        keys: ['user_id'],
        values: [user_id]
    });
}
