import { io } from 'socket.io-client';
const chat_socket = io('http://localhost:4000');
export default chat_socket;