import WhatsAppBot from "@green-api/whatsapp-bot";
import "dotenv/config";
import { connection } from "./db/database.js";
import { create, get } from './services/UserService.js';
import { cleanPhoneNumber } from "./module.js";
import LanguageSelectionHandler from "./handlers/LanguageSelectionHandler.js";
import MenuHandler from "./handlers/MenuHandler.js";
import LanguageSelectionOptionsHandler from "./handlers/LanguageSelectionOptionsHandler.js";
import DriverRegisterHandler from "./handlers/Driver/DriverRegisterHandler.js";
import { ICommandHandler } from "./interfaces/ICommandHandler.js";
import { IUserData } from "./interfaces/IUser.js";
import OrderRegisterHandler from "./handlers/Order/OrderRegisterHandler.js";
import DriverApplyHandler from "./handlers/Driver/DriverApplyHandler.js";

// Создаем ватсап бота и передаем токены
const bot = new WhatsAppBot({
    idInstance: process.env.ID_INSTANCE ?? '',
    apiTokenInstance: process.env.API_KEY ?? ''
});

console.log('WhatsApp bot started...')

bot.on('message', async (event) => {
    try {
        if (event.message && event.message.text && event.chat && event.chat.id) {

            const command: string = event.message.text.toLocaleLowerCase();
            const clientId: number = event.chat.id;
            // Извлекаем чистый номер телефона без дополнительных символов
            const number: string = cleanPhoneNumber(clientId.toString());

            // Выполняем запрос к базе данных для получения информации о пользователе
            const data: IUserData = await get(connection, number);

            if (data && data.user_id) {
                
                if(data.user_id === 11) {
                    console.log(123)
                }else {
                    const handlers: ICommandHandler[] = [
                        new LanguageSelectionHandler(),
                        new LanguageSelectionOptionsHandler(),
                        new MenuHandler(),
                        new DriverRegisterHandler(),
                        new DriverApplyHandler(),
                        new OrderRegisterHandler(),
                    ];
    
                    for (const handler of handlers) {
    
                        if(await handler.execute(event, command, data.user_lang, {
                            connection: connection,
                            user_id: data.user_id
                        }, data)) {
                            return;
                        }
                    }
                }

            } else {
                console.log(`User with number ${number} not found`);
                if(number.length > 11) console.log(`User with number ${number} is group!`)
                else await create(connection, number);
            }
        }
    } catch (err) {
        console.error('Error processing message:', err);
    }
});

// Запуск бота
bot.launch();
