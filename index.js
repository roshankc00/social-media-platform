const express=require("express")
const cors=require('cors')
const handleError = require("./middlewares/errorHandler")
const connectDb = require("./config/ConnectDb")
require('dotenv').config({path:"./config/.env"})
const cookieParser = require("cookie-parser")
const morgan=require('morgan')


// connecting to the database 
connectDb()


// rest variables
const app=express()
const port=process.env.PORT



// routes imports
const userRoute=require('./routes/userRoutes')
// middlewares
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(cookieParser())

// all the routes 
app.use("/api/v1/user",userRoute)
app.use(handleError)


// listening to the port 
app.listen(port,()=>{
    console.log(`listening at the port ${port}`)
})