const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "MailJet",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
//TODO: add email verification
const URL = "/magic/";

const sendMagicLink = async (email, magicLink, type) => {
  if (type === "signup") {
    var subject = "Your sign up link";
    var body =
      '<p>Hello friend welcome. This is your link to sign in to your account: <a href="' +
      (URL + email + "/" + magicLink) +
      '">Click here</a></p><p>Needless to remind you not to share this link with anyone 🤫</p>';
  } else {
    var subject = "Welcome back";
    var body =
      '<p>Hello friend and welcome back. This is your link to sign in to your account: <a href="' +
      (URL + email + "/" + magicLink) +
      '">Click here</a></p><p>Needless to remind you not to share this link with anyone 🤫</p>';
  }

  const options = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: subject,
    html: body,
  };
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = { sendMagicLink };
