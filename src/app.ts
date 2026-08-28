import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk
app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "Quiz API is running",
    });
});

export default app;