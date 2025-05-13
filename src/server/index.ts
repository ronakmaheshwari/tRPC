import {router} from "./trpc"
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { todoRouter } from "./todo";
import { userRouter } from "./user";

const appRouter=router({
    todo: todoRouter,
    user: userRouter
})

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3001);

export type AppRouter = typeof appRouter;
