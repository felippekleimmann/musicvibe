import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Artist = sequelize.define('Artist', { name: { type: DataTypes.STRING, allowNull: false }, biography: { type: DataTypes.TEXT }, imageUrl: { type: DataTypes.STRING }, active: { type: DataTypes.BOOLEAN, defaultValue: true } });
