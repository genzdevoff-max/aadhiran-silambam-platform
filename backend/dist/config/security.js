"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = void 0;
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET must be configured.');
    return secret;
};
exports.getJwtSecret = getJwtSecret;
