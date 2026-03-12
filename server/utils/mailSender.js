// const nodemailer = require("nodemailer");

// const mailSender = async(email ,title ,body) => {
//     try{
//         // //create transport
//         // let transporter = nodemailer.createTransport({
//         //     host: process.env.MAIL_HOST,
//         //     /* edited parts are port and secure fields*/
//         //     port: 587,                       // use 465 for SSL
//         //     secure: false,
//         //     auth : {
//         //         user:process.env.MAIL_USER,
//         //         pass:process.env.MAIL_PASS,
//         //     },
//         //     logger: true,   // <--- enables detailed logs
//         //     debug: true  
            
//         // })
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS
//         },
//         logger: true,   // <--- enables detailed logs
//         debug: true 
//       }); 
//         //send mail
//         let info = await transporter.sendMail({
//             /*edited part is the process.env in the from field */
//             from: `"SkillOwl" <${process.env.MAIL_USER}>`,
//             to: `${email}`,
//             subject: `${title}`,
//             html:`${body}`
//         })
//         console.log("Email sent:", info.messageId);
//         console.log("MAIL_HOST =", process.env.MAIL_HOST);
//         return info;
//     } 
//     catch (error) {
//     console.error("Error sending email:", error);
//     if (error.response) console.error("SMTP response:", error.response);
//     throw error;
//     }
// }

// module.exports = mailSender;

// // const sgMail = require("@sendgrid/mail");

// // sgMail.setApiKey(process.env.SENDGRID_API);

// // const mailSender = async (email, title, body) => {
// //   try {
// //     const msg = {
// //       to: email, // recipient
// //       from: process.env.SENDGRID_FROM, // must be your verified sender
// //       subject: title,
// //       html: body,
// //     };

// //     const response = await sgMail.send(msg);
// //     console.log("Email sent:", response[0].statusCode);
// //     return response;
// //   } catch (error) {
// //     console.error("Error sending email:", error.response?.body || error);
// //     throw error;
// //   }
// // };

// // module.exports = mailSender;
const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const mailSender = async (email, title, body) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: { email: "yourgmail@gmail.com", name: "SkillOwl" },
      to: [{ email }],
      subject: title,
      htmlContent: body
    });

    console.log("Email sent:", response);
    return response;

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = mailSender;
