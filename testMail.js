require("dotenv").config();
const sendMail = require("./server/utils/mailSender");

(async () => {
  try {
    const info = await sendMail(
      "ece.22bech98@silicon.ac.in",  // use a different email to receive
      "Test Mail from SkillOwl",
      "<p>Hello 👋 this is a test email!</p>"
    );
    console.log("Local test successful:", info);
  } catch (err) {
    console.error("Local test failed:", err);
  }
})();
