import { TelegrafContext } from "@green-api/whatsapp-bot/src/typings/context";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../interfaces/ICommandHandler.js";
import { update } from "../services/SqlService.js";
import { IUserData } from "../interfaces/IUser.js";

class LanguageSelectionHandler implements ICommandHandler {

    blockingPermissions: string[] = ['driver_register'];
    permissionCommand: string = 'lang_select';
    commandTriggers: ITriggerObject[] = [
        {
            lang: 'ru',
            text: 'язык'
        },
        {
            lang: 'kz',
            text: 'тіл'
        }
    ];

    async execute(event: TelegrafContext, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {
        
        if(data && this.blockingPermissions.includes(data?.user_command)) return false;

        if(!this.commandTriggers.find(
            obj => obj.text === command 
        )) return false;

        if(connection) {
            event.reply('_Тіл таңдаңыз/Выберите язык_ \n\nҚазақша\nРусский');
            update(connection, {
                table: 'users',
                keys: ['user_command'],
                values: [this.permissionCommand]
            });
            return true;
        }
        return false;
    }
    
}

export default LanguageSelectionHandler;