const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db")

const app = express()
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dotenv.config();

const PORT = process.env.port || 5000;

app.listen(PORT , ()=>{console.log(`Server running on Port ${PORT}`)});

connectToMongo();

const UserRouter = require("./Routes/User");
const ProductRouter = require("./Routes/Product.js");
const ContestRouter = require("./Routes/Contest.js");

app.use("/api/user" , UserRouter.router);
app.use("/api/product" , ProductRouter.router);
app.use("/api/contest" , ContestRouter.router);

