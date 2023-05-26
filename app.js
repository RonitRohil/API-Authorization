require('dotenv').config();
const express = require("express");
const app = express();
const conn = require("./config/auth.database");
const router = require("./routes/auth.route")

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use("/",router)

app.listen(port, async(req,res)=>{
    await conn;
    console.log(`server is running at port no ${port}`)
})