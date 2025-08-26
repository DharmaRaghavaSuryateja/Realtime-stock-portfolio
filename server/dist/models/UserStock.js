var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from 'sequelize-typescript';
let UserStock = class UserStock extends Model {
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_stock_id',
    }),
    __metadata("design:type", Number)
], UserStock.prototype, "user_stock_id", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], UserStock.prototype, "user_id", void 0);
__decorate([
    Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'stock_code',
    }),
    __metadata("design:type", String)
], UserStock.prototype, "stock_code", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], UserStock.prototype, "quantity", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'purchase_price',
    }),
    __metadata("design:type", Number)
], UserStock.prototype, "purchase_price", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'purchase_date',
    }),
    __metadata("design:type", Date)
], UserStock.prototype, "purchase_date", void 0);
UserStock = __decorate([
    Table({
        tableName: 'users_stocks',
        timestamps: true,
    })
], UserStock);
export default UserStock;
