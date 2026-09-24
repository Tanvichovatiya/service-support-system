import { sendMail } from "./sendMail.js"


export const sendStaffInvitationMail = async({email,firstname,lastname,employeeId,department,setupUrl}) =>{
 try {
  await sendMail({
    to:email,
    subject:"Staff Account Created - Set Your Password",
    html:` <div style=" font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px; " > 
    <h2> Welcome to Service Support System </h2> 
    <p> Hello ${firstname} ${lastname}, </p> 
    <p> An administrator has created a staff account for you. </p> 
    <h3> Your Staff Details </h3> 
    <p> <strong>Employee ID:</strong> ${employeeId} </p> 
    <p> <strong>Department:</strong> ${department} </p> 
    <p> <strong>Email:</strong> ${email} </p> 
    <p> Please click the button below to create your password. 
    </p> 
    <div style="margin: 30px 0;"> 
    <a href="${setupUrl}" style=" background: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; " > Set Your Password </a> 
    </div> 
    <p> This password setup link will expire in <strong>30 minutes</strong>. </p> 
    <p> If you did not expect this account, please contact your administrator. </p> 
    <p> Regards, <br /> Service Support System </p>
    </div> `,
  })
 } catch (error) {
   console.log("sendStaffInvitationMail error :",error)
   throw error
 }
}