const SibApiV3Sdk = require('sib-api-v3-sdk');

const setupBrevo = () => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    return new SibApiV3Sdk.TransactionalEmailsApi();
};

/**
 * @desc    Send Generic Email
 */
const sendEmail = async (to, subject, content, isHtml = false) => {
    if (!process.env.BREVO_API_KEY) {
        console.warn('BREVO_API_KEY not found. Email not sent.');
        return;
    }

    const apiInstance = setupBrevo();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    const senderEmail = process.env.SENDER_EMAIL || "admin@placepro.com";
    console.log(`[DEBUG] Attempting to send email from: ${senderEmail} via Brevo`);
    sendSmtpEmail.sender = { name: "PlacePro Admin", email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];
    
    if (isHtml) {
        sendSmtpEmail.htmlContent = content;
    } else {
        sendSmtpEmail.textContent = content;
    }

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error("Brevo Email Error:", error);
        return false;
    }
};

/**
 * @desc    Send Welcome Email after Registration
 */
const sendWelcomeEmail = async (user) => {
    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">Welcome to PlacePro, ${user.firstName}!</h2>
            <p>Your journey to your dream career starts here. Your profile has been successfully created.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Role:</strong> ${user.role.toUpperCase()}</p>
                <p><strong>Username:</strong> ${user.username}</p>
            </div>
            <p>Log in now to complete your profile and start applying for tier-1 roles.</p>
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold;">Login to Dashboard</a>
            <p style="margin-top: 30px; color: #94a3b8; font-size: 12px;">© 2026 PlacePro Management System</p>
        </div>
    `;
    return sendEmail(user.email, "Welcome to PlacePro! 🚀", htmlContent, true);
};

/**
 * @desc    Send Application Status Notification
 */
const sendStatusNotification = async (user, jobTitle, status, interviewTime = null) => {
    let statusMessage = status === 'Accepted' 
        ? "Congratulations! Your application has been shortlisted." 
        : status === 'Interview' 
        ? "Great news! An interview has been scheduled for your application."
        : "Thank you for your interest. Unfortunately, your application was not selected at this time.";

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">Application Update</h2>
            <p>Hi ${user.firstName},</p>
            <p>There has been an update to your application for <strong>${jobTitle}</strong>.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>New Status:</strong> <span style="color: ${status === 'Rejected' ? '#ef4444' : '#10b981'}; font-weight: bold;">${status}</span></p>
                ${interviewTime ? `<p><strong>Scheduled Time:</strong> ${new Date(interviewTime).toLocaleString()}</p>` : ''}
            </div>
            <p>${statusMessage}</p>
            <a href="${process.env.FRONTEND_URL}/student/applications" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Application</a>
        </div>
    `;
    return sendEmail(user.email, `PlacePro Update: ${jobTitle}`, htmlContent, true);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendStatusNotification
};
