const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db")

const app = express()
app.use(cors({
    origin:  ["https://shop-nest-frontend.vercel.app" , "http://localhost:3000"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.options("" ,cors({
    origin:  ["https://shop-nest-frontend.vercel.app", "http://localhost:3000" ],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}) )

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dotenv.config();

const PORT = process.env.port || 5000;

app.listen(PORT , ()=>{console.log(`Server running on Port ${PORT}`)});

app.get("/",(req,res)=>{
    res.send("Server");
})

connectToMongo();

const UserRouter = require("./Routes/User");
const ProductRouter = require("./Routes/Product.js");
const ContestRouter = require("./Routes/Contest.js");

app.use("/api/user" , UserRouter.router);
app.use("/api/product" , ProductRouter.router);
app.use("/api/contest" , ContestRouter.router);

