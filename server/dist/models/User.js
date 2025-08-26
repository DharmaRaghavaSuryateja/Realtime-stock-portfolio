var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, DeletedAt, } from 'sequelize-typescript';
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
let User = class User extends Model {
    get deleted() {
        return !!this.deletedAt;
    }
    set deleted(value) {
        if (value) {
            this.deletedAt = new Date();
        }
        else {
            this.deletedAt = undefined;
        }
    }
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({
        type: DataType.STRING(10),
        allowNull: false,
        defaultValue: 'INR',
    }),
    __metadata("design:type", String)
], User.prototype, "local_currency", void 0);
__decorate([
    DeletedAt,
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
User = __decorate([
    Table({
        tableName: 'users',
        timestamps: true,
        paranoid: true,
    })
], User);
export default User;
