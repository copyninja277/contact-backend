const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const nodemailer = require("nodemailer");
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


//@desc current user OTP verification
//@route POST /api/users/send-otp
//@access private
const Otpchecker =asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: `"ContactKeeper OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for ContactKeeper",
      text: `Your OTP code is: ${otp}`
    });

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("OTP email error:", error);
    return res.status(500).json({ message: "Failed to send OTP email." });
  }
});

module.exports = {registerUser, LoginUser, currentUser, Otpchecker};
