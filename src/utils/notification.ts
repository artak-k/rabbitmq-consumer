import mqConnection from "../config/rabbitmq";
import { actions, prefixes } from "../config/constants";
import taskOperations from "../modules/task/task.operations";
import ErrorMsgResponse from "../responses/error.message";

export type INotification = {
    action: string;
    data?: any;
};

type Keys = keyof typeof actions;

interface ParsedData {
    action: typeof actions[Keys];
    data?: any;
}

export class Notification {

    static async send(notification: INotification, correlationId: string, replyTo: string) {
        await mqConnection.sendToQueue(replyTo, notification, correlationId);
    }

    static async get(msg: string, correlationId: string, replyTo: string) {
        const { data: parsed } = JSON.parse(msg).message;

        if (!Object.values(actions).includes(parsed.action)) return;

        const parsedData: ParsedData = { action: parsed.action, data: parsed.data };
        const prefix = parsedData.action.split('-')[0];

        try {
            let data;
            if (prefix === prefixes.task) {
                data = await taskOperations[parsedData.action](parsedData.data);
                data.task &&
                    await Notification.send({ action: parsedData.action, data: data.task }, correlationId, replyTo)
                data.reply({ action: 'task-get' }, replyTo)
            }
        } catch (error: any) {
            console.error(`Error While Parsing the message`, error.message);
            Notification.send({ action: parsedData.action, data: new ErrorMsgResponse(error.message) }, correlationId, replyTo)
        }
    }
}
