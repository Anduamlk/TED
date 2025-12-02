"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const database_config_1 = require("./config/database.config");
const jwt_config_1 = require("./config/jwt.config");
const sms_config_1 = require("./config/sms.config");
const auth_module_1 = require("./auth/auth.module");
const candidate_module_1 = require("./candidate/candidate.module");
const employer_module_1 = require("./employer/employer.module");
const agency_module_1 = require("./agency/agency.module");
const employer_entity_1 = require("./employer/employer.entity");
const agency_entity_1 = require("./agency/agency.entity");
const users_module_1 = require("./iam/users/users.module");
const schedule_1 = require("@nestjs/schedule");
const candidate_entity_1 = require("./candidate/candidate.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, jwt_config_1.default, sms_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const dbConfig = configService.get('database');
                    return {
                        type: 'postgres',
                        url: dbConfig.url,
                        entities: [
                            candidate_entity_1.Candidate,
                            employer_entity_1.Employer,
                            agency_entity_1.Agency,
                        ],
                        synchronize: dbConfig.synchronize,
                        ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            candidate_module_1.CandidateModule,
            employer_module_1.EmployerModule,
            agency_module_1.AgencyModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map