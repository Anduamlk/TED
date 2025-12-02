"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const auth_service_1 = require("../auth.service");
let MailService = MailService_1 = class MailService {
    authService;
    transporter;
    logger = new common_1.Logger(MailService_1.name);
    constructor(authService) {
        this.authService = authService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    async sendOtpEmail(to, otp) {
        const verificationLink = `http://localhost:3000/otp?email=${encodeURIComponent(to)}&otp=${otp}`;
        const year = new Date().getFullYear();
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: 'Akeray Property Management System - Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 3 minutes. You can also click this link: ${verificationLink}`,
            html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear User,</p>
          <p>Welcome to <strong>Akeray Property Management System</strong>!</p>
          <p>Please use the OTP below to complete your verification. This OTP is valid for <strong>3 minutes</strong>.</p>

          <div style="text-align: center; font-size: 32px; font-weight: bold; color: #007cf0; margin: 30px 0;">
            ${otp}
          </div>

          <p>Or click the button below to verify directly:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" style="background: #007cf0; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none;">Verify Email</a>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            If you did not request this OTP, you can ignore this email.
          </p>

          <p style="margin-top: 30px;">Best regards,<br>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`OTP email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send OTP email to ${to}`, error);
            throw error;
        }
    }
    async sendReapplyPendingEmail(to, role, reason) {
        const year = new Date().getFullYear();
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Your ${role} application has been updated and is pending review`,
            html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear ${role === 'OWNER' ? 'Owner' : 'Tenant'},</p>
          <p>Your application has been <strong>updated</strong> based on the previous feedback and is now <strong>pending administrator review</strong>.</p>
          ${reason ? `<p><strong>Previous rejection reason:</strong> ${reason}</p>` : ''}
          <p>We will notify you via email once your account has been reviewed.</p>
          <p style="margin-top: 30px;">Best regards,<br/>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Re-apply pending email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send re-apply pending email to ${to}`, error);
            throw error;
        }
    }
    async sendApprovalPendingEmail(to, role) {
        const year = new Date().getFullYear();
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Your ${role} application is pending approval`,
            text: `Thank you for registering as a ${role}. Your application is pending administrator approval. We will notify you by email once approved.`,
            html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear ${role === 'OWNER' ? 'Owner' : 'Tenant'},</p>
          <p>Thank you for registering with <strong>Akeray Property Management System</strong> as a <strong>${role.toLowerCase()}</strong>.</p>
          <p>Your application is currently <strong>pending administrator approval</strong>. We will notify you via email once your account has been reviewed and approved.</p>
          <p>If you have any questions, please contact our support: <a href="mailto:support@akeray.et">support@akeray.et</a>.</p>
          <p style="margin-top: 30px;">Best regards,<br/>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Approval pending email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send approval pending email to ${to}`, error);
            throw error;
        }
    }
    async sendApprovalDecisionEmail(to, role, decision) {
        const year = new Date().getFullYear();
        const subject = decision === 'approved' ? `${role} application approved` : `${role} application rejected`;
        const decisionColor = decision === 'approved' ? '#10B981' : '#EF4444';
        const decisionText = decision === 'approved' ? 'APPROVED' : 'REJECTED';
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: subject,
            html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear ${role === 'OWNER' ? 'Owner' : 'Tenant'},</p>
          <p>Your application has been <strong style="color:${decisionColor}">${decisionText}</strong> by the administrator.</p>
          ${decision === 'approved' ? '<p>You can now log in and start using the platform.</p>' : '<p>Unfortunately your application was not approved. You may contact support for more details.</p>'}
          <p style="margin-top: 30px;">Best regards,<br/>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Approval decision email (${decision}) sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send approval decision email to ${to}`, error);
            throw error;
        }
    }
    async sendLoginAlertEmail(to, role, ipAddress) {
        const loginTime = new Date().toLocaleString();
        const year = new Date().getFullYear();
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Login Alert - ${role} Account`,
            text: `Your ${role} account logged in on ${loginTime}. IP: ${ipAddress || 'Unknown'}`,
            html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear ${role},</p>
          <p>This is a security alert. Your <strong>${role}</strong> account was logged in on:</p>
          <p><strong>${loginTime}</strong></p>
          <p>IP Address: ${ipAddress || 'Unknown'}</p>

          <p>If this was you, no action is needed. If not, please change your password immediately.</p>

          <p style="margin-top: 30px;">Best regards,<br>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Login alert email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send login alert email to ${to}`, error);
            throw error;
        }
    }
    async forgotPasswordEmail(to, role) {
        const resetToken = await this.authService.generateResetToken(to, role);
        const resetLink = `http://localhost:3000/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(to)}`;
        const year = new Date().getFullYear();
        const mailOptions = {
            from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
            to,
            subject: 'Password Reset Request - Akeray Property Management System',
            text: `You requested to reset your password. Click the link to reset it: ${resetLink}`,
            html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
            <h2>Akeray Property Management System</h2>
          </div>

          <div style="padding: 30px; background-color: #fff;">
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #112c46ff; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Reset Password
              </a>
            </div>

            <p>If you did not request a password reset, please ignore this email.</p>

            <p>Thank you,<br/>The Akeray Team</p>
          </div>

          <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
            &copy; ${year} Akeray Property Management System
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Forgot password email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send forgot password email to ${to}`, error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], MailService);
//# sourceMappingURL=mail.service.js.map