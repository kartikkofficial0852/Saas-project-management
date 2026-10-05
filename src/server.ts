import app from "./app.js"
import redis from "./config/redis.js";

const PORT = 3000;

await redis.connect();

app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT} `);
})