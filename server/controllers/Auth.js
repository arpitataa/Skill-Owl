const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdated");
// const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
//sendotp ->otp generation will be here.
exports.sendOTP = async(req,res) => {
    try{

        //fetch email from req body
        const {email} = req.body;

        //check if user alr exists
        const checkUserPresent = await User.findOne({email});

        //if user alr exists,return response
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:"User already registered"
            })
        }
        
        async function generateAndStoreOTP(){
            let otp;
            let saved = false;
            //loop till we find saved value as true
            while(!saved){
                //generate otp
                otp = otpGenerator.generate(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false,
                });
                try{
                    //put the otp in db
                    await OTP.create({email , otp})
                    //if it is saved without mongodb throwing duplicate key error
                    //then mark saved as true and get out of loop.
                    saved = true;
                }
                
                //if we reach here, two possibilities:
                //1. mongo has thrown duplicate key error
                //2. any other error in the flow
                catch(error){
                    console.log("send otp error:",error)
                    //duplicate key error code
                    if(error.code === 11000) {
                        //iterate while loop another time and generate another otp
                        //and check again if mongo throws any error
                        continue;
                    }
                    //other error
                    console.log(error);
                    throw error;
                }
            }
            return otp;
        }
        const otp = await generateAndStoreOTP();
        console.log("generated otp:",otp);

        
        //return response succesfully
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

}


//signUp
exports.signup = async(req,res) => {
    try{
        //fetch db from reqq body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;

    //validate the data
    if(!firstName || !lastName || !email || !password ||
        !confirmPassword || !otp) 
        {
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
    //match 2 pwds on ui
    if(password !== confirmPassword) {
        return res.status(400).json({
            success:false,
            message: "Password and confirmed password do not match"
        })
    }
    //check user already exists or not
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already registered"
        })
    }
    //find most recent otp stored for the specific user
    const recentOtp = (await OTP.find({email})
            .sort({createdAt:-1}).limit(1))[0];
    console.log(recentOtp);
    //validate otp
    if(recentOtp.otp.length == 0) {
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP not found"
        })
    }
    else if(otp !== recentOtp.otp) {
        //invallllid otp
        return res.status(400).json({
            success:false,
            message:"Invalid otp",
        })
    }

    //hash pwd
    const hashedPassword = await bcrypt.hash(password,10);

    let approved = "";
	approved === "Instructor" ? (approved = false) : (approved = true);

    //create entry in db
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
        pendingDeletion:false,
        default:null
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

    });

    //return response
    return res.status(200).json({
        success:true,
        message:"User is registered successfully"
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again."
        })
    }

}

//login 
exports.login = async(req,res) => {
    try{
        //get data from body
        const{email,password} = req.body;
        //validation of data
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        //check if user is registered or not
        const user = await User.findOne({email})
                    .populate("additionalDetails")
                    .exec();
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registered,please register"
            })
        }
        //pwd match thn token create
        if(await bcrypt.compare(password,user.password))
        {
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            //these are js objects and do not affect the actual db
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password",
            })
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failed. Try again"
        })
    }
}

//change password
exports.changePassword = async(req,res) => {
    try{
        //fetch data
        const userId = req.user.id; 
        
        const{oldPassword,newPassword,confirmNewPassword} = req.body;
        //validate
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"both passwords should match"
            })
        }
        //check if user exists or not
        const user = await User.findById(userId);
        console.log("USER DETAIL FROM CHANGE PASSWORD -->", user);
        if(!user){
            return res.status(500).json({
                success:false,
                message:"user does not exist"
            })
        }
        //compare old pwd from db to the user entered old pwd
        const checkPassword = await bcrypt.compare(oldPassword,user.password);
        if(!checkPassword){
            return res.status(500).json({
                success:false,
                message:"old password is incorrect"
            })
        }
        //hash pwd and update in db
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        await user.save();
        
        //send mail - pwd updated
        await mailSender(
            user.email,"Password Changed",
        passwordUpdated(user.email, `${user.firstName} ${user.lastName}`)
        )
        // const emailBody = `<h2>Password changed successfully</h2>`;
        // await mailSender(email,"Password Changed",emailBody);
        //return response
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error in changing password"
        })
    }
}

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// exports.googleLogin = async(req,res) => {
//     try {
//     const { token } = req.body; // token from frontend
//     if (!token) {
//       return res.status(400).json({ success: false, message: "No token provided" });
//     }
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email, name } = ticket.getPayload();
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       // Create new user without password
//       user = await User.create({
//         email,
//         name,
//         password: null, // password not needed for Google
//         accountType: "Student", // or default
//       });
//     }

//     // Create JWT
//     const payload = { email: user.email, id: user._id, accountType: user.accountType };
//     const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

//     // Cookie
//     const options = {
//       expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//     };

//     res.cookie("token", authToken, options).status(200).json({
//       success: true,
//       token: authToken,
//       user,
//       message: "Google login successful",
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     res.status(500).json({ success: false, message: "Google login failed" });
//   }

// }
