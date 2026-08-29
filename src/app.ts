import cors from "cors";
import express from "express";
import helmet from "helmet";

import { clerkMiddleware } from "@clerk/express";

import { errorHandler } from "./middleware/error.js";
import quizRoutes from "./routes/quiz.routes";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "Quiz API is running",
    });
});

app.use("/api/v1/quizzes", quizRoutes);

// Global error handler — LAST
app.use(errorHandler);

export default app;