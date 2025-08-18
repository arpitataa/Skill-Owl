const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");



//capture payment and initiate the razorpay order
exports.capturePayment = async(req,res) => {
    //get course id and user id
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid course id
    if(!course_id) {
        return res.json({
            success:false,
            message: "Please provide course id"
        })
    }
    //valid course detail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.json({
                success:false,
                message:"Could not find the course"
            })
        }
        //user already pay for same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount:amount * 100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId : course_id,
            userId
        }
    }
    try{
        //initiate payment usin razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,

        })
    }
    catch(error){
        console.log(error);
        return res.json({
            success:false,
            message:"could not initiate order",
        })
    }

}

//verify signature of Razorpay and Server

exports.verifySignature = async(req,res) => {
    const webhookSecret = "12345678";
    const signature = req.headers("x-razorpay-signature");
    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    //match digest and signature
    if(signature === digest){
        console.log("Payment is authorized")

        //request is coming from razorpay.
        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try{
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }
            console.log(enrolledCourse);
            //find student and add course to list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},{
                    $push:{courses:courseId}
                },
                {new:true}
            )
            console.log(enrolledStudent);

            //send confirmation mail
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congrats!!",
                "Congrats, you are onboarded into new course!",

            )
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            })
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }
    //if signature and digest are not equal
    else{
        return res.status(400).json({
            success:false,
            message:"Invalid request"
        })
    }
}