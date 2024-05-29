import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const projectsSchema = new mongoose.Schema({
    links: { type: String },
    content: { type: String }
});

// Defined the Projects model
const Project = mongoose.model('Project', projectsSchema); 

// Defined the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true,trim: true, index: true},
    password: { type: String, required: true },
    resume: { type: String},
    protolab: [{
        images: { type: String },
        heading: { type: String }
    }],
    Editorial: [{
        images: { type: String },
        heading: { type: String },
        content: { type: String}
    }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    personal: [{ type: String }]
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
 const User = mongoose.model("User", userSchema)
 
 export{ User,Project}