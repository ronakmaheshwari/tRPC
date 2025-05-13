import { userModal } from "../db";
import { publicProcedure, router } from "./trpc";
import zod from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const saltround = 10;
const jwtSecret = "123456"

const SignupSchema = zod.object({
    username:zod.string().min(4).max(20),
    password:zod.string().min(5).max(50)
})

export const userRouter = router({
    Signup:publicProcedure
    .input(SignupSchema)
    .mutation(async(opts)=>{
        const {input} = opts
        const username = input.username
        const password = input.password
        const CheckUsername = await userModal.findOne({username})
        if(CheckUsername){
            throw new Error("Invalid Username provided.");
        }
        const hashedPassword= await bcrypt.hash(password,saltround)
        console.log(hashedPassword);
        const response = await userModal.create({
            username,password:hashedPassword
        })
        const token = jwt.sign({userId:response._id},jwtSecret)
        return token
    }),
    Signin:publicProcedure
    .input(SignupSchema)
    .mutation(async(opts)=>{
        const {input} = opts
        const username = input.username
        const password = input.password
        const checkUsername = await userModal.findOne({username})
        if(!checkUsername){
            throw new Error("Invalid Username provided.");
        }
        const checkPassword = await bcrypt.compare(password,checkUsername.password)
        if(!checkPassword){
            throw new Error("Invalid Password provided.");
        }
        const token = jwt.sign({userId:checkUsername._id},jwtSecret);
        return token
    }),
    GetUsers:publicProcedure
    .query(async()=>{
        const response = await userModal.find()
        return response
    })
})