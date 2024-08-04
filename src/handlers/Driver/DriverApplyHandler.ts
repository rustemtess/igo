import { Context } from "@green-api/whatsapp-bot";
import { ICommandHandler, IConnectionQuery, ITriggerObject } from "../../interfaces/ICommandHandler.js";
import { IUserData } from "../../interfaces/IUser.js";

class DriverApplyHandler implements ICommandHandler {

    permissionCommand: string = 'driver_apply';
    commandTriggers: ITriggerObject[] = [
        {
            lang: 'ru',
            text: 'принять',
            translateReply: ''
        },
        {
            lang: 'kz',
            text: 'қабылдау',
            translateReply: ''
        }
    ];

    async execute(event: Context, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean> {
        
        console.log(command, command.startsWith('принять'))

        // const object: ITriggerObject | undefined = this.commandTriggers.find( obj => 
        //     command.startsWith(obj.text) && obj.lang === lang
        // );

        const commands = command.split(' ');
        if(commands.length === 2 && Number.isInteger(Number(commands[1]))) {

            event.reply('Вы приняли заказ ' + commands[1]);

            return true;
        }else {
            console.log(commands, commands.length)
        }

        return false;
    }

}

export default DriverApplyHandler;