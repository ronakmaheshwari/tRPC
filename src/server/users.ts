import { userModal } from "../db";
import { publicProcedure, router } from "./trpc";
import z from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const jwtSecret = "123456";
const saltround = 10;

const UserSchema = z.object({
    username: z.string().min(4).max(20).regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
    password: z.string().min(8).max(20).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
      message: "Password must contain at least one letter and one number",
    })
})

const userRouter = router({
    userSignup: publicProcedure
    .input(UserSchema)
    .mutation(async({input})=>{
        const {username, password} = input;
        try {
            const Checkusername = await userModal.findOne({ username })
            if(Checkusername){
                return "Username Already Exists"
            }
            const hashedpass = await bcrypt.hash(password,saltround);
            const response = await userModal.create({username,password:hashedpass})
            const token = jwt.sign({ userId: response._id }, jwtSecret, {
                expiresIn: "1d", 
                });
            return token;
        } catch (error) {
            console.log(error)
            return "Internal Error Occured"
        }
    }),
    userLogin: publicProcedure
    .input(UserSchema)
    .mutation(async({input})=>{
        const {username, password} = input;
        try{
            const Checkusername = await userModal.findOne({username});
            if(!Checkusername){
                return "Username Doesn't Exists"
            }
            const hashedpass = await bcrypt.compare(password, Checkusername.password);
            if(!hashedpass){
                return "Password is Wrong"
            }
            const token = jwt.sign({ userId: Checkusername._id }, jwtSecret, {
                expiresIn: "1d", 
            });
            return token;
        }catch(error){
            console.log(error)
            return "Internal Error Occured" 
        }
    }),
    getUser: publicProcedure
    .query(async()=>{
        try {
            const response = await userModal.find()
            return response
        } catch (error) {
            const response = await userModal.find()
            return response
        }
    }),
    getUserByid: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
        const { id } = opts.input;
        try {
            const response = await userModal.findById(id);
            return response;
        } catch (error) {
            console.log(error);
            return "Internal Error Occurred";
        }
    })
})

export default userRouter;