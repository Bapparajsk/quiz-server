import { db } from "../prisma/db.js";

interface CreateQuizInput {
    title: string;
    description?: string;
    category?: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    timeLimit?: number;
    isPublished: boolean;
    createdById: string;
}

interface UpdateQuizInput {
    title?: string;
    description?: string | null;
    category?: string | null;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    timeLimit?: number | null;
    isPublished?: boolean;
}

interface GetQuizzesInput {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    published?: boolean;
}

/**
 * Create Quiz
 */
export async function createQuizService(input: CreateQuizInput) {
    const {
        title,
        description,
        category,
        difficulty,
        timeLimit,
        isPublished,
        createdById,
    } = input;

    // const user = await db.orm.public.User.({
    //     where: {
    //         clerkId: createdById,
    //     },
    // });

    const user = await db.orm.public.User.where({

    }).first();

    if (!user) {
        throw new Error("User not found");
    }



    const quiz = await db.quiz.create({
        data: {
            title,
            description,
            category,
            difficulty,
            timeLimit,
            isPublished,
            createdById: user.id,
        },
    });

    return quiz;
}

/**
 * Get All Quizzes
 */
export async function getQuizzesService(
    input: GetQuizzesInput,
) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const skip = (page - 1) * limit;

    const where = {
        ...(input.search
            ? {
                OR: [
                    {
                        title: {
                            contains: input.search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        description: {
                            contains: input.search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),

        ...(input.category
            ? {
                category: input.category,
            }
            : {}),

        ...(input.difficulty
            ? {
                difficulty: input.difficulty,
            }
            : {}),

        ...(input.published !== undefined
            ? {
                isPublished: input.published,
            }
            : {}),
    };

    const [quizzes, total] = await Promise.all([
        db.quiz.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),

        db.quiz.count({
            where,
        }),
    ]);

    return {
        data: quizzes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get Quiz By ID
 */
export async function getQuizByIdService(
    quizId: string,
) {
    const quiz = await db.quiz.findUnique({
        where: {
            id: quizId,
        },
    });

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    return quiz;
}

/**
 * Update Quiz
 */
export async function updateQuizService(
    quizId: string,
    clerkUserId: string,
    input: UpdateQuizInput,
) {
    const user = await db.user.findUnique({
        where: {
            clerkId: clerkUserId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const quiz = await db.quiz.findUnique({
        where: {
            id: quizId,
        },
    });

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    if (quiz.createdById !== user.id) {
        throw new Error(
            "You are not allowed to update this quiz",
        );
    }

    return db.quiz.update({
        where: {
            id: quizId,
        },
        data: input,
    });
}

/**
 * Delete Quiz
 */
export async function deleteQuizService(
    quizId: string,
    clerkUserId: string,
) {
    const user = await db.user.findUnique({
        where: {
            clerkId: clerkUserId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const quiz = await db.quiz.findUnique({
        where: {
            id: quizId,
        },
    });

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    if (quiz.createdById !== user.id) {
        throw new Error(
            "You are not allowed to delete this quiz",
        );
    }

    await db.quiz.delete({
        where: {
            id: quizId,
        },
    });
}