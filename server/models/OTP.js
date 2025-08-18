const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        // unique:true,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 5*60,
    }
})
OTPSchema.index({ email: 1, otp: 1 }, { unique: true });

//otp is sent on mail. function is in utils
// pre middleware -->


async function sendVerificationEmail (email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",emailTemplate(otp));
        console.log("email sent successfully:",mailResponse);
    }
    catch(error){
        console.log("error occurred while sending mails: ",error);
        throw error;
    }
}

//pre middleware to verify before dcument is saved
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);