import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Favorite = sequelize.define('Favorite', { type: { type: DataTypes.ENUM('track', 'artist'), allowNull: false } });
