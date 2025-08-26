import jwtService from '@/services/jwtService';
export function successResponse(res, data, statusCode = 200) {
    const response = {
        success: true,
        data,
    };
    return res.status(statusCode).json(response);
}
export function errorResponse(res, message, statusCode = 400, metadata = {}) {
    const response = {
        success: false,
        message,
        metadata,
    };
    return res.status(statusCode).json(response);
}
export function toUserResponse(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        local_currency: user.local_currency,
        deleted: user.deleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
export function generateTokens(user) {
    const accessToken = jwtService.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        local_currency: user.local_currency,
    });
    const refreshToken = jwtService.generateRefreshToken({
        userId: user.id,
    });
    return { accessToken, refreshToken };
}
