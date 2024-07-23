var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import WhatsAppBot from "@green-api/whatsapp-bot";
import "dotenv/config";
import { connection } from "./db/database.js";
import { create, get } from './services/UserService.js';
import { cleanPhoneNumber } from "./module.js";
import LanguageSelectionHandler from "./handlers/LanguageSelectionHandler.js";
import MenuHandler from "./handlers/MenuHandler.js";
import LanguageSelectionOptionsHandler from "./handlers/LanguageSelectionOptionsHandler.js";
import DriverRegisterHandler from "./handlers/Driver/DriverRegisterHandler.js";
// Создаем ватсап бота и передаем токены
const bot = new WhatsAppBot({
    idInstance: (_a = process.env.ID_INSTANCE) !== null && _a !== void 0 ? _a : '',
    apiTokenInstance: (_b = process.env.API_KEY) !== null && _b !== void 0 ? _b : ''
});
console.log('WhatsApp bot started...');
bot.on('message', (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (event.message && event.message.text && event.chat && event.chat.id) {
            const command = event.message.text.toLocaleLowerCase();
            const clientId = event.chat.id;
            // Извлекаем чистый номер телефона без дополнительных символов
            const number = cleanPhoneNumber(clientId.toString());
            // Выполняем запрос к базе данных для получения информации о пользователе
            const data = yield get(connection, number);
            if (data && data.user_id) {
                const handlers = [
                    new LanguageSelectionHandler(),
                    new LanguageSelectionOptionsHandler(),
                    new MenuHandler(),
                    new DriverRegisterHandler()
                ];
                for (const handler of handlers) {
                    if (yield handler.execute(event, command, data.user_lang, {
                        connection: connection,
                        user_id: data.user_id
                    }, data)) {
                        return;
                    }
                }
            }
            else {
                console.log(`User with number ${number} not found`);
                if (number.length > 11)
                    console.log(`User with number ${number} is group!`);
                else
                    yield create(connection, number);
            }
        }
    }
    catch (err) {
        console.error('Error processing message:', err);
    }
}));
// Запуск бота
bot.launch();
