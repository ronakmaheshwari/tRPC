import { todoModal } from "../db";
import { publicProcedure, router } from "./trpc";
import z from "zod";

const TodoSchema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  userId: z.string()
});

const todoRouter = router({
  getTodo: publicProcedure.query(async () => {
    try {
      const response = await todoModal.find();
      if (response.length === 0) {
        return { message: "No Todos in DB" };
      }
      return response;
    } catch (error) {
      console.error(error);
      return { error: "Failed to fetch todos" };
    }
  }),

  createTodo: publicProcedure
    .input(TodoSchema)
    .mutation(async ({ input }) => {
        const { title, description, completed, userId } = input;
        const response = await todoModal.create({
          title,
          description,
          completed,
          userId
        });
        return response;
    }),
});

export default todoRouter;
