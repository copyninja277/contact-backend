const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser =asynchandler( async(req,res)=>{
    const { username, email, password } = req.body;
    if (!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const UserAvailable = await User.findOne({email});
    if(UserAvailable){
        res.status(400);
        throw new Error("User already registered");
    }

    //Hash password
    const hashedpassword = await bcrypt.hash(password,10);
    console.log("hashed password is ",hashedpassword);
    const user = await User.create({
        username,
        email,
        password:hashedpassword,
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json(user);
});

//@desc Login user
//@route POST /api/users/login
//@access public
const LoginUser =asynchandler( async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory !");  
    }
    const user = await User.findOne({email});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password))){
    const accessToken =jwt.sign({
        user:{
            username:user.username,
            email:user.email,
            id:user.id,
        },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn :"15m"}
    );
    res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
    
});

//@desc current user information
//@route GET /api/users/current
//@access private
const currentUser =asynchandler( async(req,res)=>{
    res.json(req.user);
});

module.exports = {registerUser, LoginUser, currentUser};