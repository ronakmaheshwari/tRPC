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
  // let deleted = await trpc.todo.DeleteTodo.mutate({id:"6823885155a99b25691084d3"})
  // console.log(deleted)

  // let gettodo = await trpc.todo.GetTodo.query()
  // console.log(gettodo)

  let signin = await trpc.user.Signin.mutate({
    username:"ronak",
    password:"123456"
  })
  console.log(signin)

  // let create = await trpc.todo.CreateTodo.mutate({
  //   id:"68239b44068cae7e9403b0e7",
  //   title:"Learning tRPC's",
  //   description:"EndPoint Hits up Here"
  // })
  // console.log(create)
  
  // let getUsers = await trpc.user.GetUsers.query()
  // console.log(getUsers)
}

main()