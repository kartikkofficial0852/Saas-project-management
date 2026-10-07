import { randomUUID } from "node:crypto";
import { getChannel } from "./connection";


export const publishEvent = (event: string, data: any) => {

    const channel = getChannel();

    channel.publish(
        "saas.events",
        event,
        Buffer.from(JSON.stringify(data)),
        {
            persistent: true,
            messageId: randomUUID(),
        }
    )
}