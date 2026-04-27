import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();
export const now = () => Math.floor(Date.now() / 1000); // Unix timestamp in seconds