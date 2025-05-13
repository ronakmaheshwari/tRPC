import express, { NextFunction, Request, Response } from "express"
import morgan from "morgan"
import 'dotenv/config'
import cors from "cors"
import router from "./routes";


const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use("/api/v1",router)

app.listen(port,()=>{
    console.log(`App is running on http://localhost:${port}/`);
})
