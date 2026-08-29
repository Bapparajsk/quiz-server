import { Router } from "express";

import {
    createQuiz,
    deleteQuiz,
    getQuizById,
    getQuizzes,
    updateQuiz,
} from "../controllers/quiz.controller.js";

import { requireUser } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import {
    createQuizSchema,
    deleteQuizSchema,
    getQuizByIdSchema,
    getQuizzesSchema,
    updateQuizSchema,
} from "../validators/quiz.schema.js";

const router = Router();

// GET /api/v1/quizzes
router.get(
    "/",
    validate(getQuizzesSchema),
    getQuizzes,
);

// GET /api/v1/quizzes/:quizId
router.get(
    "/:quizId",
    validate(getQuizByIdSchema),
    getQuizById,
);

// POST /api/v1/quizzes
router.post(
    "/",
    requireUser,
    validate(createQuizSchema),
    createQuiz,
);

// PATCH /api/v1/quizzes/:quizId
router.patch(
    "/:quizId",
    requireUser,
    validate(updateQuizSchema),
    updateQuiz,
);

// DELETE /api/v1/quizzes/:quizId
router.delete(
    "/:quizId",
    requireUser,
    validate(deleteQuizSchema),
    deleteQuiz,
);

export default router;