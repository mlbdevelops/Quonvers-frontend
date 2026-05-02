export * from './SaveMessage';
export * from './Attachments';
export * from './Reactions';
export * from './ReadReceipts';
export * from './Status';
export * from './sendMessage';

//import { EventEmitter } from 'events';
export const messageEmitter = {
  on: null,
  emit: null
}