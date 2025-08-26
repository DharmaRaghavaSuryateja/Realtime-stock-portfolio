import User, { UserRole } from './User';
import UserStock from './UserStock';
User.hasMany(UserStock, {
    foreignKey: 'user_id',
    as: 'userStocks',
});
UserStock.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});
export { User, UserStock, UserRole };
