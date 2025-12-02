import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private readonly logger;
    private readonly resetPasswordSecret;
    private readonly resetPasswordExpiresIn;
    private readonly jwtSecret;
    private readonly jwtRefreshSecret;
    private readonly jwtExpiresIn;
    private readonly jwtRefreshExpiresIn;
    constructor(jwtService: JwtService);
    getTokens(id: number, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateResetToken(email: string, role: string): Promise<string>;
    verifyResetToken(token: string): Promise<{
        email: string;
    }>;
}
