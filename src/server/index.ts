import todoRouter from "./todo";
import { publicProcedure, router } from "./trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const appRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC v10!'),
  todo:todoRouter
});
 
// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3000);