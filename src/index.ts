import config from "./config/config"
import mqConnection from "./config/rabbitmq"
import { Notification } from "./utils/notification"

(async () => {
    await startConsumers()
})()

async function startConsumers() {
    try {
        await mqConnection.consume(config.NOTIFICATION_QUEUE.queue, Notification.get);
    } catch (error: any) {
        console.error(`Error occurred while starting consumers: ${error.message}`, error);
    }
}