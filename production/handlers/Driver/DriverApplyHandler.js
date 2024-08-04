var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DriverApplyHandler {
    constructor() {
        this.permissionCommand = 'driver_apply';
        this.commandTriggers = [
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
    }
    execute(event, command, lang, connection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(command, command.startsWith('принять'));
            // const object: ITriggerObject | undefined = this.commandTriggers.find( obj => 
            //     command.startsWith(obj.text) && obj.lang === lang
            // );
            const commands = command.split(' ');
            if (commands.length === 2 && Number.isInteger(Number(commands[1]))) {
                event.reply('Вы приняли заказ ' + commands[1]);
                return true;
            }
            else {
                console.log(commands, commands.length);
            }
            return false;
        });
    }
}
export default DriverApplyHandler;
