import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { z } from "zod";

export function validate(schema: z.ZodType) {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const data = result.data as {
            body: unknown;
            params: unknown;
            query: unknown;
        };

        req.body = data.body;
        req.params = data.params as typeof req.params;
        req.query = data.query as typeof req.query;

        next();
    };
}