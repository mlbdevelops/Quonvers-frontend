import { getDb } from './db';

export const initDatabase = async () => {
  const db = await getDb();
  try {
  /*
  await db.execAsync(`
    DROP TABLE chat_theme
  `)
  
  await db.execAsync(`
    ALTER TABLE chat_theme
    ADD COLUMN source_type TEXT DEFAULT 'app' NOT NULL
  `)
  
  await db.execAsync(`
    ALTER TABLE messages
    ADD COLUMN room_type TEXT DEFAULT 'private'
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
      is_pro BOOLEAN DEFAULT false,
      UNIQUE(user_id)
    );
    
    -- DISAPEARING MESSAGES
    CREATE TABLE IF NOT EXISTS disappear_setting (
      chat_id TEXT NOT NULL UNIQUE,
      disappearing_millisecs INTEGER DEFAULT 0 NOT NULL,
      ui_index INTEGER DEFAULT 0 NOT NULL,
      set_by TEXT,
      UNIQUE(chat_id)
    );
    
    --THEME
    CREATE TABLE IF NOT EXISTS chat_theme (
      chat_id TEXT PRIMARY KEY,
      bg_uri TEXT DEFAULT 'bg_default',
      bg_opacity INTEGER DEFAULT 0.4,
      bubble_color TEXT DEFAULT '#5E4BFA',
      UNIQUE(chat_id)
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
      last_message_status TEXT,
      created_at INTEGER,
      status TEXT,
      has_unread BOOLEAN DEFAULT false,
      muted BOOLEAN DEFAULT false,
      disappearing_duration INTEGER,
      last_change_timestamp INTEGER,
      pinned BOOLEAN DEFAULT false,
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
      disappearing_millisecs INTEGER,
      status TEXT,
      status_at INTEGER,
      room_type TEXT DEFAULT 'private',
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
    
    CREATE TABLE IF NOT EXISTS pending_aks(
      status TEXT NOT NULL,
      msg_id TEXT NOT NULL,
      toUser TEXT NOT NULL,
      at TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS pending_msg_updates(
      message_id TEXT NOT NULL,
      content TEXT,
      toUser TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      command TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS pinned_messages(
      message_id TEXT NOT NULL UNIQUE,
      pinned_at INTEGER NOT NULL,
      unpin_at INTEGER NOT NULL,
      chat_id TEXT NOT NULL
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
    console.error('Database error', error);
  }
};