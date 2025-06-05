import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';
import { User } from '../server/db';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      async headers() {
        return {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQxMzJjMWFlNjU5NWM4NDQ2NTFkYzIiLCJpYXQiOjE3NDkxMDMyOTcsImV4cCI6MTc0OTEwNjg5N30.Nt0zLykgCjPccO_DCTT0vOdmuh_7bkfooPYoKq-Rfv0"
        }
      },
    }),
  ],
});

async function main() {
    // const user = await trpc.user.signup.mutate({
    //     username: "harkirat123@gmail.com",
    //     password: "!23456"
    // });
    // console.log(user.token);
    
    const todo = await trpc.todo.todoCreate.mutate({description: "adsa", title: "asd"});
    console.log(todo);
}

main();