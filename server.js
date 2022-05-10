const express=require("express")
const connectDB=require("./config/database")

const  mongoose = require('mongoose');


const app=express();

const cors = require("cors");
app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from
    // // }) browser to pass through
  })
);
// connectDB()
//init middleware //

app.use(express.json());
app.use(express.urlencoded({extended:true}))
connectDB()

app.get("/",(req,res)=>res.send("API RUNNING"))
//define a routes
app.use("/api/users",require("./routes/api/users"))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/profile",require("./routes/api/profile"))
app.use("/api/posts",require("./routes/api/posts"))

const PORT=process.env.PORT ||5000;


app.listen(PORT,()=>console.log(`sever started port ${PORT}`))