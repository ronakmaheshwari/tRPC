import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      async headers() {
        return {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODNmYmRiNjU5NWRhN2FmYTc1ZDJiYjMiLCJpYXQiOjE3NDkwMjE4NzYsImV4cCI6MTc0OTEwODI3Nn0.lzSLmJA5R5RrqKMqSNRBrtw9MypvJE858o7FZ_e9ZLI"
        };
      }
    })
  ],
});

async function main(){

    // const resp = await trpc.todo.createTodo.mutate({
    //     title:"Ronak At its peak",
    //     description:"The GOAT Created",
    //     userId:"6824e878dafca213b3139c7c"
    // })

    // const response = await trpc.todo.getTodo.query();
    // console.log(response);

    // const resp = await trpc.todo.dynamicRoute.query({title:"Ronak At its peak"})
    // console.log(resp);

    // const resp = await trpc.user.userLogin.mutate({username:"jedi",password:"Hyperbeast@77"})
    const resp = await trpc.todo.userTodos.query();
    console.log(resp);
}

main();