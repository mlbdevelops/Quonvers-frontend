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
    
    -- THEME
    CREATE TABLE IF NOT EXISTS chat_theme (
      chat_id TEXT PRIMARY KEY NOT NULL,
      background TEXT NOT NULL,
      msg_res_color TEXT,
      msg_log_color TEXT
    );
    
    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      name TEXT,
      user_id TEXT,
      avatar TEXT,
      phone TEXT,
      bio TEXT,
      is_verified BOOLEAN DEFAULT false,
      created_at INTEGER,
      updated_at INTEGER
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
      read_receipts BOOLEAN DEFAULT true,
      quick_reaction TEXT,
      allow_forwarding BOOLEAN DEFAULT false,
      allow_copying BOOLEAN DEFAULT false,
      disappearing_enabled BOOLEAN DEFAULT false,
      disappearing_duration INTEGER,
      pinned_at INTEGER,
      archived BOOLEAN DEFAULT false
    );
    
    -- CHAT MEMBERS
    CREATE TABLE IF NOT EXISTS chat_members (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      user_id TEXT,
      nickname TEXT,
      role TEXT,
      muted BOOLEAN DEFAULT false,
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
      media_url TEXT,
      reply_to TEXT,
      has_attachment BOOLEAN DEFAULT false,
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
    
    -- MESSAGE RECEIPTS
    CREATE TABLE IF NOT EXISTS message_receipts (
      message_id TEXT,
      user_id TEXT,
      delivered_at INTEGER,
      read_at INTEGER,
      PRIMARY KEY(message_id, user_id)
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