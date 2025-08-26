import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
} from 'sequelize-typescript';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  local_currency: string;
  deleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: 'INR',
  })
  local_currency!: string;

  @DeletedAt
  deletedAt?: Date;

  get deleted(): boolean {
    return !!this.deletedAt;
  }

  set deleted(value: boolean) {
    if (value) {
      this.deletedAt = new Date();
    } else {
      this.deletedAt = undefined;
    }
  }
}
