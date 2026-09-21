import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Genre = sequelize.define('Genre', { name: { type: DataTypes.STRING, allowNull: false, unique: true }, description: { type: DataTypes.TEXT }, active: { type: DataTypes.BOOLEAN, defaultValue: true } });
