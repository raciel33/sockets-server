
import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;

export const MONGODB_URI = process.env.DB_CNN || ''