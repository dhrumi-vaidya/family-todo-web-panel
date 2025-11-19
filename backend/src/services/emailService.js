const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    // For development, use ethereal email (fake SMTP)
    // In production, replace with real SMTP credentials
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    });
};

// Send invitation email
exports.sendInvitationEmail = async (email, familyName, inviteLink, inviterName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.SMTP_FROM || 'Family Todo App <noreply@familytodo.com>',
            to: email,
            subject: `You're invited to join ${familyName}!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d6efd;">🎉 Family Invitation</h2>
          <p>Hi there!</p>
          <p><strong>${inviterName}</strong> has invited you to join the <strong>${familyName}</strong> family on Family Todo App.</p>
          <p>Click the button below to accept the invitation and create your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #0d6efd; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #6c757d; font-size: 14px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
          <hr style="border: 1px solid #e9ecef; margin: 20px 0;">
          <p style="color: #6c757d; font-size: 12px;">
            Family Todo App - Manage your family's tasks and bills together
          </p>
        </div>
      `
        };

        // In development, if no SMTP configured, just log
        if (!process.env.SMTP_USER) {
            console.log('📧 Email would be sent to:', email);
            console.log('Invite link:', inviteLink);
            return { success: true, preview: inviteLink };
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Failed to send invitation email');
    }
};

// Send approval notification
exports.sendApprovalEmail = async (email, familyName, approved) => {
    try {
        const transporter = createTransporter();

        const subject = approved
            ? `Welcome to ${familyName}!`
            : `Invitation to ${familyName} was not approved`;

        const html = approved
            ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ Your request has been approved!</h2>
          <p>Great news! You've been approved to join <strong>${familyName}</strong>.</p>
          <p>You can now log in and start collaborating with your family members!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="background-color: #28a745; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
      `
            : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">❌ Invitation Not Approved</h2>
          <p>We're sorry, but your request to join <strong>${familyName}</strong> was not approved by the family admin.</p>
          <p>If you believe this was a mistake, please contact the person who invited you.</p>
        </div>
      `;

        const mailOptions = {
            from: process.env.SMTP_FROM || 'Family Todo App <noreply@familytodo.com>',
            to: email,
            subject,
            html
        };

        if (!process.env.SMTP_USER) {
            console.log('📧 Approval email would be sent to:', email, '- Approved:', approved);
            return { success: true };
        }

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Failed to send approval email');
    }
};
