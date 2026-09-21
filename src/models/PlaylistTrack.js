import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const PlaylistTrack = sequelize.define('PlaylistTrack', { position: { type: DataTypes.INTEGER, defaultValue: 1 } });
