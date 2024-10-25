import { INotification, Notification } from "../../utils/notification";
import { taskStates, taskTypes } from "../../config/constants";

class TaskService {
    static async get(data: any) {
        const task = { ...JSON.parse(data.value), state: taskStates.inprogress }
        return {
            task,
            reply: (notification: INotification, replyTo: string) => {
                task.state = (task.state === taskStates.inprogress && task.taskType === taskTypes.regular) ? taskStates.completed : taskStates.canceled
                new Promise(resolve => resolve(task)).delay().then(task => {
                    notification.data = task
                    Notification.send(notification, '', replyTo)
                });
            }
        }
    }

}

export default TaskService