import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const Playlist = sequelize.define('Playlist', { name: { type: DataTypes.STRING, allowNull: false }, description: { type: DataTypes.TEXT }, visibility: { type: DataTypes.ENUM('private', 'public'), defaultValue: 'private' } });
