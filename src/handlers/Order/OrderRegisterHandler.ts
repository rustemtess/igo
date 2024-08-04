import { Context } from "@green-api/whatsapp-bot";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../../interfaces/ICommandHandler.js";
import { IUserData } from "../../interfaces/IUser.js";
import { deleteFromDB, insert, update } from "../../services/SqlService.js";
import { cleanPhoneNumber } from "../../module.js";
import { pasteText } from "../../module.js";
import { IOrderData } from "../../interfaces/IOrder.js";
import { get } from "../../services/OrderService.js";
import { OrderDelete } from "./OrderModule.js";
import { sendMessage } from "../../chat.js";

class OrderRegisterHandler implements ICommandHandler {

    permissionCommand: string = 'order';
    commandTriggers: ITriggerObject[] = [
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

    pathMessages: string = 'handlers/Order/OrderMessages.json';
    connection?: IConnectionQuery | undefined;

    nextStep(step: number): void {
        if(this.connection) update(this.connection, {
            table: 'users',
            keys: ['user_order_step'],
            values: [step]
        });
    }

    async execute(event: Context, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {
        
        const object: ITriggerObject | undefined = this.commandTriggers.find( obj => 
            obj.text === command && obj.lang === lang
        );

        if(object && object.translateReply && connection && data) {
            event.reply(object.translateReply);
            await update(connection, {
                table: 'users',
                keys: ['user_command', 'user_order_step'],
                values: [this.permissionCommand, 1]
            });
            const OrderData: IOrderData = await get(connection.connection, data.user_id);
            if(OrderData && OrderData.order_id && OrderData.order_price) {
                await deleteFromDB(connection, {
                    table: 'orders',
                    keys: ['user_id'],
                    values: [data.user_id]
                })
                await sendMessage("⛔ Клиент отменил заказ *№" + OrderData.order_id + "*");
            }
            await insert(connection, {
                table: 'orders',
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
                const OrderData: IOrderData = await get(connection.connection, data.user_id);
                await event.reply('Вы отменили заказ');
                OrderDelete(connection, OrderData.user_id);
                if(OrderData.order_price) 
                    await sendMessage("⛔ Клиент отменил заказ *№" + OrderData.order_id + "*");
                this.nextStep(0);
                return true;
            }

            switch(data.user_order_step) {
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
                    const OrderData: IOrderData = await get(connection.connection, data.user_id);
                    if(OrderData.order_price) event.reply('Вы уже заказали ожидайте...');
                    else {
                        if(!Number.isInteger(Number(command))) event.reply('Укажите правильную сумму');
                        else if(Number.isInteger(Number(command)) && Number(command) <= 300)
                            event.reply('Цена начинается с 300 ₸, укажите другую сумму');
                        else {
                            event.reply('🚕 Ожидайте ваш заказ отправлен...');
                            update(connection, {
                                table: 'orders',
                                keys: ['order_price'],
                                values: [command]
                            });
                            const OrderData: IOrderData = await get(connection.connection, data.user_id);
                            await sendMessage("❗ *Новый заказ* ❗\n\nНомер заказа: _№" + OrderData.order_id + "_\nОткуда: _" + OrderData.order_from + "_\nКуда: _" + OrderData.order_to + "_\nЦена: _" + OrderData.order_price + " ₸_\n\nЧтобы принять напишите *Принять (Номер заказа)*");
                        }
                    }
                    break;
            }

            return true;
        }

        return false;
    }

}

export default OrderRegisterHandler;