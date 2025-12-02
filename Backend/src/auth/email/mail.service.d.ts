import { AuthService } from '../auth.service';
export declare class MailService {
    private readonly authService;
    private readonly transporter;
    private readonly logger;
    constructor(authService: AuthService);
    sendOtpEmail(to: string, otp: string): Promise<void>;
    sendReapplyPendingEmail(to: string, role: 'OWNER' | 'TENANT', reason?: string | null): Promise<void>;
    sendApprovalPendingEmail(to: string, role: 'OWNER' | 'TENANT'): Promise<void>;
    sendApprovalDecisionEmail(to: string, role: 'OWNER' | 'TENANT', decision: 'approved' | 'rejected'): Promise<void>;
    sendLoginAlertEmail(to: string, role: string, ipAddress?: string): Promise<void>;
    forgotPasswordEmail(to: string, role: string): Promise<void>;
}
