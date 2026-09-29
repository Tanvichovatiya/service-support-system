import transporter from "../config/mail.js";

export const sendMail = async ({to,subject,html,}) => {

  try {
    
    const info = await transporter.sendMail({
      from: `"Service Support System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    // console.log("info:",info)

    // console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.log("sendMail error:", error);
    throw error;
  }
};