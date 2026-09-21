import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Review = sequelize.define('Review', { rating: { type: DataTypes.INTEGER, allowNull: false }, comment: { type: DataTypes.TEXT } });
