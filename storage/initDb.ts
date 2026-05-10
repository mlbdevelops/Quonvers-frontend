import { getDb } from './db';

export const initDatabase = async () => {
  const db = await getDb();
  try {
  /*
  await db.execAsync(`
    DROP TABLE messages
  `)
  
  return await db.execAsync(`
    ALTER TABLE messages
    ADD COLUMN status TEXT status_at INTEGER
  `)
  */
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    
    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      username TEXT,
      name TEXT,
      avatar TEXT,
      is_pro BOOLEAN DEFAULT false
    );
    
    -- CHATS
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      type TEXT,
      name TEXT,
      avatar TEXT,
      last_message_id TEXT,
      last_message_preview TEXT,
      last_message_at INTEGER,
      last_message_sender_id TEXT,
      created_at INTEGER,
      status TEXT,
      theme BLOB,
      read_receipts BOOLEAN DEFAULT true,
      muted BOOLEAN DEFAULT false,
      disappearing_duration INTEGER,
      pinned_at INTEGER,
      favorite BOOLEAN DEFAULT false,
      archived BOOLEAN DEFAULT false,
      locked BOOLEAN DEFAULT false
    );
    
    -- CHAT MEMBERS
    CREATE TABLE IF NOT EXISTS chat_members (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      user_id TEXT,
      nickname TEXT,
      role TEXT DEFAULT member,
      muted BOOLEAN DEFAULT false,
      allow_forwarding BOOLEAN DEFAULT false,
      last_read_message_id TEXT,
      last_read_at INTEGER,
      unread_count INTEGER DEFAULT 0,
      joined_at INTEGER,
      can_send_messages BOOLEAN DEFAULT true,
      UNIQUE(chat_id, user_id)
    );
    
    -- MESSAGES
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      sender_id TEXT,
      content TEXT,
      type TEXT,
      content_url TEXT,
      reply_to TEXT,
      edited BOOLEAN DEFAULT false,
      deleted BOOLEAN DEFAULT false,
      server_id TEXT,
      status TEXT,
      status_at INTEGER,
      disappears_at INTEGER,
      created_at INTEGER,
      updated_at INTEGER
    );
    
    -- MESSAGE REACTIONS
    CREATE TABLE IF NOT EXISTS message_reactions (
      id TEXT PRIMARY KEY,
      message_id TEXT,
      user_id TEXT,
      reaction TEXT,
      reacted_at INTEGER,
      UNIQUE(message_id, user_id)
    );
    
    -- ATTACHMENTS
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT,
      type TEXT,
      uri TEXT,
      width INTEGER,
      height INTEGER,
      duration INTEGER,
      size INTEGER,
      created_at INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS pendings(
      message_id TEXT NOT NULL,
      toUser TEXT NOT NULL,
      room_type TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS requests(
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      toUser TEXT NOT NULL,
      sent_at TEXT NOT NULL,
      message TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS sent_requests(
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      toUser TEXT NOT NULL,
      last_sent TEXT NOT NULL,
      message TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS accepted_requests(
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      toUser TEXT NOT NULL,
      accepted_at TEXT NOT NULL
    );
    
    -- INDEXES
    CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
    CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);
    CREATE INDEX IF NOT EXISTS idx_attachments_message ON attachments(message_id);
    CREATE INDEX IF NOT EXISTS idx_chats_last_message ON chats(last_message_at DESC);
  `);

  console.log('Database initialized ✅');
  } catch (error) {
    console.error(error);
  }
};