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
class LanguageSelectionOptionsHandler {
    constructor() {
        this.blockingPermissions = ['driver_register'];
        this.commandTriggers = [
            {
                lang: 'ru',
                text: 'русский',
                translateReply: 'Вы выбрали русский язык!'
            },
            {
                lang: 'kz',
                text: 'қазақша',
                translateReply: 'Сіз қазақша тілді таңдадыңыз!'
            }
        ];
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data && this.blockingPermissions.includes(data === null || data === void 0 ? void 0 : data.user_command))
                return false;
            const object = this.commandTriggers.find(obj => obj.text === command);
            if (object && object.translateReply && connection) {
                event.reply(object.translateReply);
                update(connection, {
                    table: 'users',
                    keys: ['user_lang'],
                    values: [object.lang]
                });
                return true;
            }
            return false;
        });
    }
}
export default LanguageSelectionOptionsHandler;
