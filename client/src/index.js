import ReactDom from 'react-dom/client';
import App from './App';
import './index.css';
import { createContext } from 'react';
import { PlayerContext } from './Context/PlayerContext';
import { io } from 'socket.io-client';
export const SocketContext = createContext();

const socket = io.connect('http://localhost:3030/');

ReactDom.createRoot(document.querySelector('#root')).render(
  <SocketContext.Provider value={socket}>
    <PlayerContext>
      <App />
    </PlayerContext>
  </SocketContext.Provider>
);
