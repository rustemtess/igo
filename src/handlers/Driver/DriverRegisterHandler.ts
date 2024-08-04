import { Context } from "@green-api/whatsapp-bot";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../../interfaces/ICommandHandler.js";
import { deleteFromDB, insert, update } from "../../services/SqlService.js";
import { IUserData } from "../../interfaces/IUser.js";
import { cleanPhoneNumber, isValidNumber } from "../../module.js";
import { DriverDelete } from "./DriverModule.js";
import { IDriverData } from "../../interfaces/IDriver.js";
import { get } from "../../services/DriverService.js";
import { pasteText } from "../../module.js";

class DriverRegisterHandler implements ICommandHandler {

    permissionCommand: string =  'driver_register';
    commandTriggers: ITriggerObject[] = [
        {
            lang: 'ru',
            text: 'такси',
            translateReply: 'Введите имя'
        },
        {
            lang: 'kz',
            text: 'такси',
            translateReply: 'Есіміңізді еңгізіңіз'
        }
    ];

    connection?: IConnectionQuery | undefined;
    pathMessages: string = 'handlers/Driver/DriverMessages.json';

    nextStep(step: number): void {
        if(this.connection) update(this.connection, {
            table: 'users',
            keys: ['user_driver_step'],
            values: [step]
        });
    }

    async execute(event: Context, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {

        const object: ITriggerObject | undefined = this.commandTriggers.find( obj => 
            obj.text === command && obj.lang === lang
        );

        if(object && object.translateReply && connection && data) {
            event.reply(object.translateReply);
            update(connection, {
                table: 'users',
                keys: ['user_command', 'user_driver_step'],
                values: [this.permissionCommand, 1]
            });
            deleteFromDB(connection, {
                table: 'drivers',
                keys: ['user_id'],
                values: [data.user_id]
            })
            insert(connection, {
                table: 'drivers',
                keys: ['user_id'],
                values: [connection.user_id]
            });
            return true;
        }

        else if(
            event.message && 
            event.message.text &&
            event.chat && 
            data && data.user_command && 
            data.user_command === this.permissionCommand && 
            connection && lang
        ) {
            const number: string = cleanPhoneNumber(event.chat.id.toString());
            this.connection = connection;

            if(command === pasteText(this.pathMessages, lang, 0).toLowerCase()) {
                const DriverData: IDriverData = await get(connection.connection, data.user_id);
                await event.reply(pasteText(this.pathMessages, lang, 12, [
                    ['{driver_id}', DriverData.driver_id]
                ]));
                DriverDelete(connection, data.user_id);
                this.nextStep(0);
                return true;
            }

            switch(data.user_driver_step) {
                case 1:
                    event.reply(pasteText(this.pathMessages, lang, 1));
                    update(connection, {
                        table: 'drivers',
                        keys: ['driver_name'],
                        values: [event.message.text]
                    });
                    this.nextStep(2);
                    break;
                case 2:
                    event.reply(pasteText(this.pathMessages, lang, 2, [ [
                        '{number}', number
                    ] ]));
                    update(connection, {
                        table: 'drivers',
                        keys: ['driver_lastname'],
                        values: [event.message.text]
                    });
                    this.nextStep(3);
                    break;
                case 3:
                    if(command === pasteText(this.pathMessages, lang, 6).toLowerCase()) {
                        event.reply(pasteText(this.pathMessages, lang, 3, [ [
                            '{number}', number
                        ] ]));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_phone_number'],
                            values: [number]
                        });
                        this.nextStep(4);
                    }
                    else if(isValidNumber(command)) {
                        event.reply(pasteText(this.pathMessages, lang, 3, [ [
                            '{number}', number
                        ] ]));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_phone_number'],
                            values: [command]
                        });
                        this.nextStep(4); 
                    }

                    else event.reply(pasteText(this.pathMessages, lang, 7));

                    break;
                case 4:
                    if(command === pasteText(this.pathMessages, lang, 6).toLowerCase()) {
                        event.reply(pasteText(this.pathMessages, lang, 4));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_kaspi_number'],
                            values: [number]
                        });
                        this.nextStep(5);
                    }
                    else if(isValidNumber(command)) {
                        event.reply(pasteText(this.pathMessages, lang, 4));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_kaspi_number'],
                            values: [command]
                        });
                        this.nextStep(5);
                    }

                    else event.reply(pasteText(this.pathMessages, lang, 7));

                    break;
                case 5:
                    event.reply(pasteText(this.pathMessages, lang, 5));
                    update(connection, {
                        table: 'drivers',
                        keys: ['driver_car_model'],
                        values: [event.message.text]
                    });
                    this.nextStep(6);

                    break;
                case 6:
                    await update(connection, {
                        table: 'drivers',
                        keys: ['driver_car_number'],
                        values: [event.message.text]
                    });
                    const DriverData: IDriverData = await get(connection.connection, data.user_id);
                    await event.reply(pasteText(this.pathMessages, lang, 8, [
                        ['{name}', DriverData.driver_name],
                        ['{lastname}', DriverData.driver_lastname],
                        ['{phone_number}', DriverData.driver_phone_number],
                        ['{kaspi_number}', DriverData.driver_kaspi_number],
                        ['{car_model}', DriverData.driver_car_model],
                        ['{car_number}', DriverData.driver_car_number]
                    ]));
                    this.nextStep(7);

                    break;
                case 7:
                    if(command === pasteText(this.pathMessages, lang, 9).toLowerCase()) {
                        event.reply(pasteText(this.pathMessages, lang, 11));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_confirm'],
                            values: [1]
                        });
                    }else {
                        event.reply(pasteText(this.pathMessages, lang, 10));
                    }

                    break;
            }

            return true;
        }

        return false;
    }

}

export default DriverRegisterHandler;