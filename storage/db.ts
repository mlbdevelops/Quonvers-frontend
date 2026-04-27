import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = "quonvers.db";
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return await dbPromise;
};
export default getDb; 