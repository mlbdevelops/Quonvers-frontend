export * from './Messages';
export * from './Attachments';
export * from './Reactions';
export * from './ReadReceipts';
export * from './Status';

//import { EventEmitter } from 'events';
export const messageEmitter = {
  on: null,
  emit: null
}