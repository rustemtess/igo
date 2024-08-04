import { Context } from "@green-api/whatsapp-bot";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../interfaces/ICommandHandler.js";
import { update } from "../services/SqlService.js";
import { IUserData } from "../interfaces/IUser.js";

class LanguageSelectionOptionsHandler implements ICommandHandler {

    blockingPermissions: string[] = ['driver_register'];
    commandTriggers: ITriggerObject[] = [
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

    async execute(event: Context, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {

        if(data && this.blockingPermissions.includes(data?.user_command)) return false;

        const object: ITriggerObject | undefined = this.commandTriggers.find( 
            obj => obj.text === command 
        );

        if(object && object.translateReply && connection) {
            event.reply(object.translateReply);
            update(connection, {
                table: 'users',
                keys: ['user_lang'],
                values: [object.lang]
            });
            return true;
        }

        return false;
    }

}

export default LanguageSelectionOptionsHandler;