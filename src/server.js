import 'dotenv/config';
import app from './app.js';
import { testConnection } from './config/database.js';
const PORT = process.env.PORT || 3000;
await testConnection();
app.listen(PORT, () => { console.log(`🎵 MusicVibe rodando em http://localhost:${PORT}`); });
