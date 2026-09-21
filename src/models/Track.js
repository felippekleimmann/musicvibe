import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Track = sequelize.define('Track', { title: { type: DataTypes.STRING, allowNull: false }, duration: { type: DataTypes.INTEGER, defaultValue: 0 }, audioUrl: { type: DataTypes.STRING, allowNull: false }, coverUrl: { type: DataTypes.STRING }, playCount: { type: DataTypes.INTEGER, defaultValue: 0 }, active: { type: DataTypes.BOOLEAN, defaultValue: true } });
