import 'dotenv/config';

export const PORT = process.env.PORT || 3001;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:3001';
