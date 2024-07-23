var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { deleteFromDB, insert, update } from "../../services/SqlService.js";
import { cleanPhoneNumber, isValidNumber } from "../../module.js";
import { DriverDelete } from "./DriverModule.js";
import { readFileSync } from "fs";
import { get } from "../../services/DriverService.js";
class DriverRegisterHandler {
    constructor() {
        this.permissionCommand = 'driver_register';
        this.commandTriggers = [
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
    }
    nextStep(step) {
        if (this.connection)
            update(this.connection, {
                table: 'users',
                keys: ['user_driver_step'],
                values: [step]
            });
    }
    pasteText(lang, n, arg) {
        const DriverMessage = JSON.parse(readFileSync('./src/handlers/Driver/DriverMessages.json', 'utf-8'));
        console.log('DriverMessage:', DriverMessage);
        console.log('lang:', lang, 'n:', n);
        let obj;
        if (lang === 'kz') {
            if (!DriverMessage.kz || !DriverMessage.kz[n]) {
                console.error('Invalid index or missing language key for kz');
                return '';
            }
            obj = DriverMessage.kz[n].toString();
        }
        else {
            if (!DriverMessage.ru || !DriverMessage.ru[n]) {
                console.error('Invalid index or missing language key for ru');
                return '';
            }
            obj = DriverMessage.ru[n].toString();
        }
        console.log('Initial obj:', obj);
        if (!arg)
            return obj;
        for (const [alias, text] of arg) {
            if (alias === undefined || text === undefined) {
                console.error('Undefined alias or text in argument array', arg);
                continue;
            }
            obj = obj.replace(alias.toString(), text.toString());
        }
        return obj;
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = this.commandTriggers.find(obj => obj.text === command && obj.lang === lang);
            if (object && object.translateReply && connection && data) {
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
                });
                insert(connection, {
                    table: 'drivers',
                    keys: ['user_id'],
                    values: [connection.user_id]
                });
                return true;
            }
            else if (event.message &&
                event.message.text &&
                event.chat &&
                data && data.user_command &&
                data.user_command === this.permissionCommand &&
                connection && lang) {
                const number = cleanPhoneNumber(event.chat.id.toString());
                this.connection = connection;
                if (command === this.pasteText(lang, 0).toLowerCase()) {
                    const DriverData = yield get(connection.connection, data.user_id);
                    yield event.reply(this.pasteText(lang, 12, [
                        ['{driver_id}', DriverData.driver_id]
                    ]));
                    DriverDelete(connection, data.user_id);
                    this.nextStep(0);
                    return false;
                }
                switch (data.user_driver_step) {
                    case 1:
                        event.reply(this.pasteText(lang, 1));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_name'],
                            values: [event.message.text]
                        });
                        this.nextStep(2);
                        break;
                    case 2:
                        event.reply(this.pasteText(lang, 2, [[
                                '{number}', number
                            ]]));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_lastname'],
                            values: [event.message.text]
                        });
                        this.nextStep(3);
                        break;
                    case 3:
                        if (command === this.pasteText(lang, 6).toLowerCase()) {
                            event.reply(this.pasteText(lang, 3, [[
                                    '{number}', number
                                ]]));
                            update(connection, {
                                table: 'drivers',
                                keys: ['driver_phone_number'],
                                values: [number]
                            });
                            this.nextStep(4);
                        }
                        else if (isValidNumber(command)) {
                            event.reply(this.pasteText(lang, 3, [[
                                    '{number}', number
                                ]]));
                            update(connection, {
                                table: 'drivers',
                                keys: ['driver_phone_number'],
                                values: [command]
                            });
                            this.nextStep(4);
                        }
                        else
                            event.reply(this.pasteText(lang, 7));
                        break;
                    case 4:
                        if (command === this.pasteText(lang, 6).toLowerCase()) {
                            event.reply(this.pasteText(lang, 4));
                            update(connection, {
                                table: 'drivers',
                                keys: ['driver_kaspi_number'],
                                values: [number]
                            });
                            this.nextStep(5);
                        }
                        else if (isValidNumber(command)) {
                            event.reply(this.pasteText(lang, 4));
                            update(connection, {
                                table: 'drivers',
                                keys: ['driver_kaspi_number'],
                                values: [command]
                            });
                            this.nextStep(5);
                        }
                        else
                            event.reply(this.pasteText(lang, 7));
                        break;
                    case 5:
                        event.reply(this.pasteText(lang, 5));
                        update(connection, {
                            table: 'drivers',
                            keys: ['driver_car_model'],
                            values: [event.message.text]
                        });
                        this.nextStep(6);
                        break;
                    case 6:
                        yield update(connection, {
                            table: 'drivers',
                            keys: ['driver_car_number'],
                            values: [event.message.text]
                        });
                        const DriverData = yield get(connection.connection, data.user_id);
                        yield event.reply(this.pasteText(lang, 8, [
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
                        if (command === this.pasteText(lang, 9).toLowerCase()) {
                            event.reply(this.pasteText(lang, 11));
                            update(connection, {
                                table: 'drivers',
                                keys: ['driver_confirm'],
                                values: [1]
                            });
                        }
                        else {
                            event.reply(this.pasteText(lang, 10));
                        }
                        break;
                }
                return true;
            }
            return false;
        });
    }
}
export default DriverRegisterHandler;
