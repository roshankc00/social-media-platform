const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:[true,"email must be unique"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
   

},{timestamsps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()

})

userSchema.methods.isPasswordTrue=async function(password){
    const wow=await bcrypt.compare(password,this.password)
    return wow

    

}

const User=mongoose.model("User",userSchema)
module.exports=User