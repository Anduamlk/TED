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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = AuthService_1 = class AuthService {
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    resetPasswordSecret;
    resetPasswordExpiresIn;
    jwtSecret;
    jwtRefreshSecret;
    jwtExpiresIn;
    jwtRefreshExpiresIn;
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.resetPasswordSecret = process.env.RESET_PASSWORD_SECRET || 'resetSecret';
        this.resetPasswordExpiresIn = process.env.RESET_PASSWORD_EXPIRES_IN || '15m';
        this.jwtSecret = process.env.JWT_SECRET || 'secret';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'refreshSecret';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    }
    async getTokens(id, email, role) {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync({ sub: id, email, role }, { secret: this.jwtSecret, expiresIn: this.jwtExpiresIn }),
                this.jwtService.signAsync({ sub: id, email, role }, { secret: this.jwtRefreshSecret, expiresIn: this.jwtRefreshExpiresIn }),
            ]);
            return { accessToken, refreshToken };
        }
        catch (error) {
            this.logger.error('Token generation failed', error.stack);
            throw new common_1.InternalServerErrorException('Could not generate tokens');
        }
    }
    async generateResetToken(email, role) {
        return this.jwtService.signAsync({ email, role }, {
            secret: this.resetPasswordSecret,
            expiresIn: this.resetPasswordExpiresIn,
        });
    }
    async verifyResetToken(token) {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: this.resetPasswordSecret,
            });
            return { email: decoded.email };
        }
        catch (err) {
            this.logger.error('Failed to verify reset token', err);
            throw new common_1.ForbiddenException('Invalid or expired reset token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map