import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";


export const bookRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const { db } = ctx;
        const books = await db.book.findMany();

        console.log(books)

        return books
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
        const { db } = ctx;
        const book = await db.book.findUnique({
            where: { id: input.id },
        });
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }),

    create: protectedProcedure
        .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            publishedAt: z.date().optional(),
            author: z.string(),
            genre: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return db.book.create({
                data: input,
            });
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.number(),
            title: z.string().optional(),
            description: z.string().optional(),
            publishedAt: z.date().optional(),
            author: z.string().optional(),
            genre: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const book = await db.book.update({
                where: { id: input.id },
                data: input,
            });
            return book;
        }),

    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
        const { db } = ctx;
        const book = await db.book.delete({
            where: { id: input.id },
        });
        return book;
    }),
});
