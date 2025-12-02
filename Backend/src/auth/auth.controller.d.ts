import { AuthService } from './auth.service';
import { MailService } from './email/mail.service';
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    constructor(authService: AuthService, mailService: MailService);
}
