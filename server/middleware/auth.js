const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//authn
exports.auth = async(req,res,next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token
        || req.header("Authorization").replace("Bearer","");
        //validation -> if no token, return
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }
        //verify the token and pass the payload to req user obj
        try{
            //decode has the payload data
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        });
    }
}
//authz
//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"User role cannot be verified"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}

//isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"User role cannot be verified"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"User role cannot be verified"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}