// server/api/routers/listRouter.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    return db.list.findMany({
      include: {
        user: true,
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const list = await db.list.findUnique({
      where: { id: input.id },
      include: {
        user: true,
        books: {
          include: {
            book: true,
          },
        },
      },
    });
    if (!list) {
      throw new Error("List not found");
    }
    return list;
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.list.create({
        data: {
          name: input.name,
          user: { connect: { id: input.userId } },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const list = await db.list.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
      return list;
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const list = await db.list.delete({
      where: { id: input.id },
    });
    return list;
  }),

  addBook: protectedProcedure
    .input(z.object({
      listId: z.number(),
      bookId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.listBook.create({
        data: {
          listId: input.listId,
          bookId: input.bookId,
        },
      });
    }),

  removeBook: protectedProcedure
    .input(z.object({
      listId: z.number(),
      bookId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const listBook = await db.listBook.findUnique({
        where: {
          listId_bookId: {
            listId: input.listId,
            bookId: input.bookId,
          },
        },
      });
      if (!listBook) {
        throw new Error("Book not found in list");
      }
      return db.listBook.delete({
        where: {
          listId_bookId: {
            listId: input.listId,
            bookId: input.bookId,
          },
        },
      });
    }),
});
