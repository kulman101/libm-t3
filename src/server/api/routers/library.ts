import { UserRole } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const libraryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    return db.library.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const library = await db.library.findUnique({
      where: { id: input.id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!library) {
      throw new Error("Library not found");
    }
    return library;
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.library.create({
        data: {
          name: input.name,
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
      const library = await db.library.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
      return library;
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const library = await db.library.delete({
      where: { id: input.id },
    });
    return library;
  }),

  addUser: protectedProcedure
    .input(z.object({
      libraryId: z.number(),
      userId: z.string(),
      role: z.nativeEnum(UserRole),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.userLibrary.create({
        data: {
          libraryId: input.libraryId,
          userId: input.userId,
          role: input.role,
        },
      });
    }),

  removeUser: protectedProcedure
    .input(z.object({
      libraryId: z.number(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const userLibrary = await db.userLibrary.findUnique({
        where: {
          userId_libraryId: {
            userId: input.userId,
            libraryId: input.libraryId,
          },
        },
      });
      if (!userLibrary) {
        throw new Error("User not found in library");
      }
      return db.userLibrary.delete({
        where: {
          userId_libraryId: {
            userId: input.userId,
            libraryId: input.libraryId,
          },
        },
      });
    }),
});
