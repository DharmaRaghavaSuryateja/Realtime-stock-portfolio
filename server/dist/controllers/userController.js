import { Op } from 'sequelize';
import { User } from '@/models';
import { successResponse, toUserResponse } from '@/utils/response';
import { AppError } from '@/middlewares';
export const getMyProfile = async (req, res, next) => {
    const userId = req.user?.userId;
    const user = await User.findOne({
        where: { id: userId },
    });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return successResponse(res, {
        user: toUserResponse(user),
    });
};
export const updateMyProfile = async (req, res, next) => {
    const userId = req.user?.userId;
    const { username, email } = req.body;
    const user = await User.findOne({
        where: { id: userId },
    });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    if (username || email) {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : []),
                ],
                id: { [Op.ne]: userId },
            },
            paranoid: false,
        });
        if (existingUser) {
            return next(new AppError('Username or email already exists', 409));
        }
    }
    const updateData = {};
    if (username)
        updateData.username = username;
    if (email)
        updateData.email = email;
    await user.update(updateData);
    return successResponse(res, {
        user: toUserResponse(user),
    });
};
export const deleteMyProfile = async (req, res, next) => {
    const userId = req.user?.userId;
    const user = await User.findByPk(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    await user.destroy();
    return successResponse(res, {});
};
