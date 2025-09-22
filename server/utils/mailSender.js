// const nodemailer = require("nodemailer");

// const mailSender = async(email ,title ,body) => {
//     try{
//         //create transport
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             /* edited parts are port and secure fields*/
//             port: 487,                       // use 465 for SSL
//             secure: false,
//             auth : {
//                 user:process.env.MAIL_USER,
//                 pass:process.env.MAIL_PASS,
//             },
//             logger: true,   // <--- enables detailed logs
//             debug: true  
//         })
//         //send mail
//         let info = await transporter.sendMail({
//             /*edited part is the process.env in the from field */
//             from: `"SkillOwl" <${process.env.MAIL_USER}>`,
//             to: `${email}`,
//             subject: `${title}`,
//             html:`${body}`
//         })
//         console.log("Email sent:", info.messageId);
//         return info;
//     } 
//     catch (error) {
//     console.error("Error sending email:", error);
//     if (error.response) console.error("SMTP response:", error.response);
//     throw error;
//     }
// }

// module.exports = mailSender;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API);

const mailSender = async (email, title, body) => {
  try {
    const msg = {
      to: email, // recipient
      from: process.env.SENDGRID_FROM, // must be your verified sender
      subject: title,
      html: body,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent:", response[0].statusCode);
    return response;
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error);
    throw error;
  }
};

module.exports = mailSender;

