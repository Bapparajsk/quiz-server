import type { NextFunction, Request, Response } from "express";

import {
    createQuizService,
    deleteQuizService,
    getQuizByIdService,
    getQuizzesService,
    updateQuizService,
} from "../services/quiz.service";

/**
 * Create Quiz
 * POST /api/v1/quizzes
 */
export async function createQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const quiz = await createQuizService({
            ...req.body,
            createdById: req.userId!,
        });

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get All Quizzes
 * GET /api/v1/quizzes
 */
export async function getQuizzes(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const quizzes = await getQuizzesService(req.query);

        return res.status(200).json({
            success: true,
            data: quizzes,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get Quiz By ID
 * GET /api/v1/quizzes/:quizId
 */
export async function getQuizById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const quiz = await getQuizByIdService(req.params.quizId);

        return res.status(200).json({
            success: true,
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update Quiz
 * PATCH /api/v1/quizzes/:quizId
 */
export async function updateQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const quiz = await updateQuizService(
            req.params.quizId,
            req.userId!,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete Quiz
 * DELETE /api/v1/quizzes/:quizId
 */
export async function deleteQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        await deleteQuizService(
            req.params.quizId,
            req.userId!,
        );

        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}