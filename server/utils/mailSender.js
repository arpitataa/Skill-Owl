const nodemailer = require("nodemailer");

const mailSender = async(email ,title ,body) => {
    try{
        //create transport
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            /* edited parts are port and secure fields*/
            port: 465,                       // use 465 for SSL
            secure: true,
            auth : {
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        //send mail
        let info = await transporter.sendMail({
            /*edited part is the process.env in the from field */
            from: `"SkillOwl" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html:`${body}`
        })
        console.log("Email sent:", info.messageId);
        return info;
    } 
    catch (error) {
    console.error("Error sending email:", error);
    if (error.response) console.error("SMTP response:", error.response);
    throw error;
    }
}

module.exports = mailSender;
