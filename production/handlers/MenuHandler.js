var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { update } from "../services/SqlService.js";
class MenuHandler {
    constructor() {
        this.blockingPermissions = ['driver_register'];
        this.permissionCommand = 'menu';
        this.commandTriggers = [
            {
                lang: 'ru',
                text: 'меню',
                translateReply: '📌 Меню бота\n\n1. _Мой профиль_ - *профиль*\n2. _Заказать такси_ - *заказ*\n3. _Стать таксистом_ - *такси*\n\n❕ Для выбора напишите текст, выделенный жирным'
            },
            {
                lang: 'kz',
                text: 'мәзір',
                translateReply: '📌 Төменгі мәзір\n\n1. _Менің профилім_ - *профиль*\n2. _Таксиге тапсырыс беру_ - *тапсырыс*\n3. _Такси жүргізушісі болу_ - *такси*\n\n❕ Таңдау үшін, қоюмен жазылған мәтінді еңгізіңі'
            }
        ];
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data && this.blockingPermissions.includes(data === null || data === void 0 ? void 0 : data.user_command))
                return false;
            const object = this.commandTriggers.find(obj => obj.lang === lang &&
                obj.text === command);
            if (object && object.translateReply && connection) {
                event.reply(object.translateReply);
                update(connection, {
                    table: 'users',
                    keys: ['user_command'],
                    values: [this.permissionCommand]
                });
                return true;
            }
            ;
            return false;
        });
    }
}
export default MenuHandler;
