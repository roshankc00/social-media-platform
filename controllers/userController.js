const { validationResult, cookie } = require("express-validator");
const User = require("../modals/userModel");
const jwt=require('jsonwebtoken')








//---> register the user 
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //   throwing the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //  throwing error for the multiple emails
    const user = await User.findOne({ email });
    if (user) {
      next({ status: 400, message: "user already exists" });
    }
    // saving the user in the database
    const newUser=await User.create({
        name,
        email,
        password
    })
    // creating the token 
    const obj={
        id:newUser._id
    }
    const token=jwt.sign(obj,process.env.SECRET)
    res.cookie("token",token,{
        expires:new Date(Date.now()+100*60*60*1000),
        httpOnly:true
    }).status(200).json({
        sucess:true,
        newUser
    })
    
  } catch (error) {
    next({ message: error.message });
  }
};






// //---> login the user 
const loginUser=async(req,res,next)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            next({status:404,message:"invalid credentials"})
        }
        const isTrue=await user.matchPassword(password)
        if(!isTrue){
            next({status:404,message:"invalid credentials"})
        }
        const obj={
            id:user._id
        }
        const token=jwt.sign(obj,process.env.SECRET)
        res.cookie("token",token,{
            expires:new Date(Date.now()+100*60*60*1000),
            httpOnly:true
        }).status(200).json({
            sucess:true,
            message:"user has logged in sucess fully",
        })
     
        
        
    } catch (error) {
        next({message:error.message})          
    }
}



//---> logout the user 
const logoutUser=async(req,res,next)=>{
    // res.cookie('token',null)
    // res.send("wow")
    try {
        res.status(200).cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        }).json({
            sucess:true,
            message:"user has been sucessfully loged out"
        })
    } catch (error) {
        next({message:error.message})
    }
}


//---> follow the user 
const followUnfollowUser=async(req,res,next)=>{
    const id=req.body.user
    try {
        const followerUser=req.user
        const followingUser=await User.findById(id)
        let alreadyFollowing=false
       

    
        
        
    } catch (error) {
        next({message:error.message})

        
    }
}



// add comments 
const addcomments=async(req,res,next)=>{
    try {

        
    } catch (error) {
        next({message:error.message})
        
    }
}

const updateUserPassword=async(req,res,next)=>{
    const {email,oldPassword, newPassword,conformPassword,}=req.body
    console.log(oldPassword)
    try {
        const user=await User.findOne({email})
        if(!user){
            next({status:404,message:"user with this email dont exists"})
        }
        if(!user._id.toString()===req.user._id.toString()){
            next({status:404,message:"you cant change the password"})
        }
        if(newPassword!==conformPassword){
            next({status:400,message:"conform password and the password doesnt match"})
        }
        const isTrue=await user.matchPassword(oldPassword);
        


        if(!isTrue){
            next({status:400,message:"Enter the valid password"})
        }else{
            user.password=newPassword
            await user.save()
            res.status(200).cookie("token",null,{
                expires:new Date(Date.now()),
                httpOnly:true
            }).json({
                sucess:true,
                message:"user has been sucessfully Updated",
                user
            })
        }
        


        
    } catch (error) {
        next({message:error.message})
    }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUserPassword,
};
