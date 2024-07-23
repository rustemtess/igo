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
class LanguageSelectionHandler {
    constructor() {
        this.blockingPermissions = ['driver_register'];
        this.permissionCommand = 'lang_select';
        this.commandTriggers = [
            {
                lang: 'ru',
                text: 'язык'
            },
            {
                lang: 'kz',
                text: 'тіл'
            }
        ];
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data && this.blockingPermissions.includes(data === null || data === void 0 ? void 0 : data.user_command))
                return false;
            if (!this.commandTriggers.find(obj => obj.text === command))
                return false;
            if (connection) {
                event.reply('_Тіл таңдаңыз/Выберите язык_ \n\nҚазақша\nРусский');
                update(connection, {
                    table: 'users',
                    keys: ['user_command'],
                    values: [this.permissionCommand]
                });
            }
            return true;
        });
    }
}
export default LanguageSelectionHandler;
