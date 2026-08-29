import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from "express";

import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    // Zod validation error
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    // Application error
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });
    }

    // Unknown error
    console.error(error);

    return res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    });
};