import { TelegrafContext } from "@green-api/whatsapp-bot/src/typings/context";
import { Connection } from "mysql";
import { IUserData } from "./IUser";

export interface ITriggerObject {
    lang: string,
    text: string,
    translateReply?: string
}

export interface IConnectionQuery {
    connection: Connection,
    user_id: number
}

export interface ICommandHandler {

    blockingPermissions?: Array<string>;
    permissionCommand?: string;
    connection?: IConnectionQuery;
    pathMessages?: string;
    commandTriggers: Array<ITriggerObject>;
    execute(event: TelegrafContext, command: string, lang?: string, connection?: IConnectionQuery, data?: IUserData): Promise<boolean>;

}

export interface IMessages {
    ru: Array<String>,
    kz: Array<String>
}