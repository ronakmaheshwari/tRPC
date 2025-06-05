import todoRouter from "./todo";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import userRouter, { jwtSecret } from "./users";
import jwt from "jsonwebtoken"
import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";

// const appRouter = router({
//   // greeting: publicProcedure.query(() => 'hello tRPC v10!'),
//   todo:todoRouter,
//   user:userRouter
// });

const appRouter = mergeRouters(todoRouter,userRouter);

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext(opts: { req: { headers: Record<string, string | undefined> } }){
    const authHeader = opts.req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No or invalid authorization header');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      return {
        userId: decoded.userId, 
      };
    }catch (error) {
      throw new Error('Unauthorized: Invalid or expired token');
    }
  }
});
 
