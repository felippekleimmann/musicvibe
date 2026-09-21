import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const PlaybackHistory = sequelize.define('PlaybackHistory', { listenedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, progressSeconds: { type: DataTypes.INTEGER, defaultValue: 0 } });
