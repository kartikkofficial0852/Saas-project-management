import amqp, {
    type Channel,
    type ChannelModel,
} from "amqplib";

let connection: ChannelModel;
let channel: Channel;

export const connectQueue = async () => {
    connection = await amqp.connect(
        process.env.RABBITMQ_URL!
    ); // connect nodejs to rabbitmq server

    channel = await connection.createChannel(); // create a channel through which we can send and receive messages

    await channel.assertExchange(
        "saas.events", // create an exchange of type "topic" to route messages based on routing keys
        "topic",
        {
            durable: true,
        }
    );

    console.log("RabbitMQ connected");
};

export const getChannel = () => {
    if (!channel) {
        throw new Error(
            "RabbitMQ channel is not initialized"
        );
    }

    return channel;
};