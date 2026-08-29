import { z } from "zod";

const quizIdParams = z.object({
    quizId: z.string().trim().min(1, "Quiz ID is required"),
});

const emptyBody = z.object({});

const emptyQuery = z.object({});

/**
 * Create Quiz
 */
export const createQuizSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title cannot exceed 100 characters"),

        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),

        category: z
            .string()
            .trim()
            .min(2, "Category must be at least 2 characters")
            .max(50, "Category cannot exceed 50 characters")
            .optional(),

        difficulty: z
            .enum(["EASY", "MEDIUM", "HARD"])
            .default("MEDIUM"),

        timeLimit: z
            .number()
            .int("Time limit must be an integer")
            .min(1, "Time limit must be at least 1 minute")
            .max(180, "Time limit cannot exceed 180 minutes")
            .optional(),

        isPublished: z
            .boolean()
            .default(false),
    }),

    params: emptyBody,

    query: emptyQuery,
});

/**
 * Get all quizzes
 */
export const getQuizzesSchema = z.object({
    body: emptyBody,

    params: emptyBody,

    query: z.object({
        page: z.coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),

        search: z
            .string()
            .trim()
            .max(100)
            .optional(),

        category: z
            .string()
            .trim()
            .max(50)
            .optional(),

        difficulty: z
            .enum(["EASY", "MEDIUM", "HARD"])
            .optional(),

        published: z
            .enum(["true", "false"])
            .transform((value) => value === "true")
            .optional(),
    }),
});

/**
 * Get quiz by ID
 */
export const getQuizByIdSchema = z.object({
    body: emptyBody,

    params: quizIdParams,

    query: emptyQuery,
});

/**
 * Update Quiz
 *
 * Every field is optional because PATCH
 * only updates the fields provided.
 */
export const updateQuizSchema = z.object({
    body: z
        .object({
            title: z
                .string()
                .trim()
                .min(3, "Title must be at least 3 characters")
                .max(100, "Title cannot exceed 100 characters")
                .optional(),

            description: z
                .string()
                .trim()
                .max(500, "Description cannot exceed 500 characters")
                .nullable()
                .optional(),

            category: z
                .string()
                .trim()
                .min(2, "Category must be at least 2 characters")
                .max(50, "Category cannot exceed 50 characters")
                .nullable()
                .optional(),

            difficulty: z
                .enum(["EASY", "MEDIUM", "HARD"])
                .optional(),

            timeLimit: z
                .number()
                .int("Time limit must be an integer")
                .min(1, "Time limit must be at least 1 minute")
                .max(180, "Time limit cannot exceed 180 minutes")
                .nullable()
                .optional(),

            isPublished: z
                .boolean()
                .optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message: "At least one field is required",
            },
        ),

    params: quizIdParams,

    query: emptyQuery,
});

/**
 * Delete Quiz
 */
export const deleteQuizSchema = z.object({
    body: emptyBody,

    params: quizIdParams,

    query: emptyQuery,
});