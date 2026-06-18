import nodemailer from "nodemailer";
// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sheeaditya12@gmail.com",
    pass: "ncgi dgnx uike bjhm",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});

export { transporter };