import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'musicvibe_db_tdd',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados realizada com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
  }
};
