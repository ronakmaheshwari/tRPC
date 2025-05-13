import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001',
    }),
  ],
});

async function main() {
  let deleted = await trpc.DeleteTodo.mutate({id:"6823885155a99b25691084d3"})
  console.log(deleted)
  let gettodo = await trpc.GetTodo.query()
  console.log(gettodo)
}

main()