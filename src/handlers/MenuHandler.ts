import { Context } from "@green-api/whatsapp-bot";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../interfaces/ICommandHandler.js";
import { update } from "../services/SqlService.js";
import { IUserData } from "../interfaces/IUser.js";

class MenuHandler implements ICommandHandler {

    blockingPermissions: string[] = ['driver_register'];
    permissionCommand: string = 'menu';
    commandTriggers: ITriggerObject[] = [
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

    async execute(event: Context, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {
        
        if(data && this.blockingPermissions.includes(data?.user_command)) return false;
        
        const object: ITriggerObject | undefined = this.commandTriggers.find( 
            obj => obj.lang === lang && 
            obj.text === command 
        );

        if(object && object.translateReply && connection) {
            event.reply(object.translateReply);
            update(connection, {
                table: 'users',
                keys: ['user_command'],
                values: [this.permissionCommand]
            });
            return true;
        };

        return false;
    }

}

export default MenuHandler;