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
import { cleanPhoneNumber } from "../../module.js";
import { pasteText } from "../../module.js";
import { get } from "../../services/OrderService.js";
import { OrderDelete } from "./OrderModule.js";
import { sendMessage } from "../../chat.js";
class OrderRegisterHandler {
    constructor() {
        this.permissionCommand = 'order';
        this.commandTriggers = [
            {
                lang: 'ru',
                text: 'заказ',
                translateReply: 'Укажите адрес откуда'
            },
            {
                lang: 'kz',
                text: 'тапсырыс',
                translateReply: 'Мекенжайын енгізіңіз'
            }
        ];
        this.pathMessages = 'handlers/Order/OrderMessages.json';
    }
    nextStep(step) {
        if (this.connection)
            update(this.connection, {
                table: 'users',
                keys: ['user_order_step'],
                values: [step]
            });
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = this.commandTriggers.find(obj => obj.text === command && obj.lang === lang);
            if (object && object.translateReply && connection && data) {
                event.reply(object.translateReply);
                yield update(connection, {
                    table: 'users',
                    keys: ['user_command', 'user_order_step'],
                    values: [this.permissionCommand, 1]
                });
                const OrderData = yield get(connection.connection, data.user_id);
                if (OrderData && OrderData.order_id && OrderData.order_price) {
                    yield deleteFromDB(connection, {
                        table: 'orders',
                        keys: ['user_id'],
                        values: [data.user_id]
                    });
                    yield sendMessage("⛔ Клиент отменил заказ *№" + OrderData.order_id + "*");
                }
                yield insert(connection, {
                    table: 'orders',
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
                if (command === pasteText(this.pathMessages, lang, 0).toLowerCase()) {
                    const OrderData = yield get(connection.connection, data.user_id);
                    yield event.reply('Вы отменили заказ');
                    OrderDelete(connection, OrderData.user_id);
                    if (OrderData.order_price)
                        yield sendMessage("⛔ Клиент отменил заказ *№" + OrderData.order_id + "*");
                    this.nextStep(0);
                    return true;
                }
                switch (data.user_order_step) {
                    case 1:
                        event.reply('Укажите адрес куда вам необходимо');
                        update(connection, {
                            table: 'orders',
                            keys: ['order_from'],
                            values: [event.message.text]
                        });
                        this.nextStep(2);
                        break;
                    case 2:
                        event.reply('Укажите цену не меньше 300 ₸');
                        update(connection, {
                            table: 'orders',
                            keys: ['order_to'],
                            values: [event.message.text]
                        });
                        this.nextStep(3);
                        break;
                    case 3:
                        const OrderData = yield get(connection.connection, data.user_id);
                        if (OrderData.order_price)
                            event.reply('Вы уже заказали ожидайте...');
                        else {
                            if (!Number.isInteger(Number(command)))
                                event.reply('Укажите правильную сумму');
                            else if (Number.isInteger(Number(command)) && Number(command) <= 300)
                                event.reply('Цена начинается с 300 ₸, укажите другую сумму');
                            else {
                                event.reply('🚕 Ожидайте ваш заказ отправлен...');
                                update(connection, {
                                    table: 'orders',
                                    keys: ['order_price'],
                                    values: [command]
                                });
                                const OrderData = yield get(connection.connection, data.user_id);
                                yield sendMessage("❗ *Новый заказ* ❗\n\nНомер заказа: _№" + OrderData.order_id + "_\nОткуда: _" + OrderData.order_from + "_\nКуда: _" + OrderData.order_to + "_\nЦена: _" + OrderData.order_price + " ₸_\n\nЧтобы принять напишите *Принять (Номер заказа)*");
                            }
                        }
                        break;
                }
                return true;
            }
            return false;
        });
    }
}
export default OrderRegisterHandler;
