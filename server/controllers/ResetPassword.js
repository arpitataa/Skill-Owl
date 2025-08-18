
const User = require("../models/User")
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
//resetPasswordToken -> sends link to email to reset
//here we dont use jwt token. the token we use crypto function to generate any random string associated with the user
//we also add this string/token to the user schema
exports.resetPasswordToken = async(req,res) => {
    try{
        //get email from req body
    const email = req.body.email;
    //check user for email, email validation
    const user = await User.findOne({email});
    if(!user) {
        return res.json({
            success:false,
            message:"Your email is not registered"
        });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email},{
        token:token,
        resetPasswordExpires : Date.now() + 5*60*1000
        },
        {new:true});
    //create url to frontend which we provide in the mail
    const url = `http://localhost:3000/update-password/${token}`

    //send mail containing the url
        await mailSender(email,"Password reset Link",
            `Password reset Link : ${url}`
        )
    //return response
    return res.json({
        success:true,
        message:"Email sent successfully. Check your mail"
    })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail"
        })
    }


}

//resetPassword -> resets in db
exports.resetPassword = async(req,res) => {
    try{
        //fetch data
    const {password,confirmPassword,token} = req.body;
    //validate 
    if(password != confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching"
        });
    }
    //get userdetails from db using token
    const userDetails = await User.findOne({token});
    //if no entry - invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        })
    }
    //token time check
    if( userDetails.resetPasswordExpires < Date.now() ){
        return res.json({
            success:false,
            message:'Token is expired, regenerate your token'
        })
    }
    //hash pwd
    const hashedPassword = await bcrypt.hash(password,10);
    //update pwd in db
    await User.findOneAndUpdate(
        {token},
        {password:hashedPassword},
        {new:true}
    )
    //return res
    return res.status(200).json({
        success:true,
        message:"Password reset successful"
    })
    }
    catch(error){
        return res.status(500).json({

            success:false,
            message:"Password could not be reset."
        })
    }
}