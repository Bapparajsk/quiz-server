import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";


export function requireUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const auth = getAuth(req);

    if (!auth.isAuthenticated || !auth.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    req.userId = auth.userId;

    next();
}