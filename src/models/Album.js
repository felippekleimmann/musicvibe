import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Album = sequelize.define('Album', { title: { type: DataTypes.STRING, allowNull: false }, coverUrl: { type: DataTypes.STRING }, releaseYear: { type: DataTypes.INTEGER } });
