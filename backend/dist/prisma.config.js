"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}
exports.default = (0, config_1.defineConfig)({
    migrations: {
        seed: 'ts-node prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=prisma.config.js.map