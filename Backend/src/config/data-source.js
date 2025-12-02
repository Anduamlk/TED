"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
const user_entity_1 = require("../iam/users/entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    synchronize: true,
    logging: false,
    entities: [user_entity_1.User,],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map