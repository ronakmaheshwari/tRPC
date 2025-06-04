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
      throw new Error('Unauthorized: Invalid or expired token');
    }
  }),

  createTodo: publicProcedure
    .input(TodoSchema)
    .mutation(async (opts) => {
        const userId = opts.ctx.userId;
        const { title, description, completed } = opts.input;
        const response = await todoModal.create({
          title,
          description,
          completed,
          userId
        });
        return response;
    }),

    dynamicRoute: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async (opts) => {
      const { title } = opts.input;
      const response = await todoModal.findOne({ title });
      return response;
    }),

    userTodos: publicProcedure.query(async (opts) => {
      const userId = opts.ctx.userId;

      try {
        const todos = await todoModal.find({ userId });
        if (todos.length === 0) {
          return "No todos present";
        }
        return todos;
      } catch (error) {
        throw new Error("Failed to fetch user todos");
      }
    })
});

export default todoRouter;
