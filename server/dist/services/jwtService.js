import config from '@/config';
import jwt from 'jsonwebtoken';
class JwtService {
    constructor() {
        this.accessTokenSecret = config.jwt.accessSecret;
        this.refreshTokenSecret = config.jwt.refreshSecret;
        this.accessTokenExpiry = config.jwt.accessExpiry;
        this.refreshTokenExpiry = config.jwt.refreshExpiry;
    }
    generateAccessToken(payload) {
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry,
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry,
        });
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        }
        catch {
            throw new Error('Invalid access token');
        }
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        }
        catch {
            throw new Error('Invalid refresh token');
        }
    }
}
export default new JwtService();
