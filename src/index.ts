import dotenv from "dotenv";
import express, { Router } from "express";
import cors from "cors";
import connectDB from "./db/connectDB";


dotenv.config({
    path: './env'
})

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`⚙️  Server is running at port ${PORT}`)
        })
    }).catch((err) => {
        console.log("Error in DB connection")
        console.log(err.message);
    })

//routers 
import userRouter from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import transactionRoutes from "./routes/transaction.routes";

app.use('/api/v1/user', userRouter)
app.use('/api/v1/book', bookRoutes)
app.use('/api/v1/transaction', transactionRoutes)

app.get("/", (req, res) => {
    res.send("Hello from server")
})
