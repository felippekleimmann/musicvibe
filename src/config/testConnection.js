import 'dotenv/config';
import { testConnection } from './database.js';

await testConnection();
process.exit(0);
