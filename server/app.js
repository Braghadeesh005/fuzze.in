const express = require('express');
// const cors = require("cors")
const app = express();
// const path = require('path');

// const dotenv = require('dotenv')
// dotenv.config({path: './config.env' })
// const passport = require("passport");
// const passportStrategy = require("./passport");
// const mongoose =require("mongoose") 
// dotenv.config();

// // Google Auth - passport
// app.use(passport.initialize());
 
// //cors gateway to client
// app.use(cors());
// // app.use(
// //     cors({
// //       origin: ["https://fuzze-one.vercel.app"],
// //       methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
// //       credentials: true,
// //       allowedHeaders: ["Content-Type", "Authorization"],
// //     })
// // );

// //Connect to the DB
// require('./db/dbconn');

// //App-use
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// //Router 
// const authRoute = require("./router/auth");
// app.use("/", authRoute);

app.get("/",(req,res)=>{
  res.send("hello");
})

//Rendering Client
// app.use(express.static("client/dist"));
// app.get("/*",function(req,res) {
//     res.sendFile(path.join(__dirname, "./client/dist/index.html"));
// })
                                 
//PORT
const PORT = 4000;
app.listen(PORT,()=>console.log(`Server Running on Port ${PORT}`)); 
console.log("========================");   