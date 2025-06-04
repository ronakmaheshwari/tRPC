import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

async function main(){

    
    const resp = await trpc.todo.createTodo.mutate({
        title:"Ronak At its peak",
        description:"The GOAT Created",
        userId:"6824e878dafca213b3139c7c"
    })

    const response = await trpc.todo.getTodo.query();
    console.log(response);
}

main();