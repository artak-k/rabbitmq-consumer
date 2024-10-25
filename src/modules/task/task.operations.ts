import { actions, ITask } from "../../config/constants";
import TaskService from "./task.service";

export default {
    [actions.taskSend]: (data: ITask) => TaskService.get(data),
}