import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import routes from './routes/index.js';
import cors from "cors";
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Saas API is running"
    });
});

app.use('/api', routes)

app.use(errorMiddleware)

export default app;