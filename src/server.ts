import { Server } from "socket.io";
import app from "./app.js"
import redis from "./config/redis.js";
import { createServer } from "node:http";
import socketAuthMiddleware from "./socket/socket.middleware.js";
import socketHandlers from "./socket/socket.handler.js";
import { initializeSocket } from "./socket/socket.js";
import { connectQueue } from "./queue/connection.js";
import { startConsumers } from "./queue/consumer.js";

const PORT = 3000;

await redis.connect();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

initializeSocket(io);

io.use(socketAuthMiddleware)

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socketHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

await connectQueue(); // start the connection to RabbitMQ
await startConsumers(); // start the consumer to listen for messages from RabbitMQ

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});