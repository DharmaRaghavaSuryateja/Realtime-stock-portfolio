import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users_stocks',
  timestamps: true,
})
export default class UserStock extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_stock_id',
  })
  user_stock_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  user_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'stock_code',
  })
  stock_code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'purchase_price',
  })
  purchase_price!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'purchase_date',
  })
  purchase_date!: Date;
}
