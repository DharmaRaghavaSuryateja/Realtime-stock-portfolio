import jwtService from '@/services/jwtService';
import { AppError } from './errorHandler';
import User from '@/models/User';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next(new AppError('Unauthorized request', 401));
        }
        try {
            const decoded = jwtService.verifyAccessToken(token);
            const user = await User.findOne({
                where: { id: decoded.userId },
            });
            if (!user) {
                return next(new AppError('User not found', 401));
            }
            req.user = decoded;
            next();
        }
        catch {
            return next(new AppError('Invalid or expired access token', 403));
        }
    }
    catch {
        return next(new AppError('Authentication error', 500));
    }
};
