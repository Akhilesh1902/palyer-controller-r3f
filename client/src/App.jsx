import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Lights, Model, MyPlane, MyBox } from './ThreeJSComponents';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { createContext } from 'react';
import { io } from 'socket.io-client';
import RoomJoiningModal from './UIComponents/RoomJoiningModal';
import { useContext } from 'react';
import { SocketContext } from './index';
import { PlayerContext, usePlayerContext } from './Context/PlayerContext';
// import { PlayerContext } from './Context/PlayerContext';

const App = () => {
  const socket = useContext(SocketContext);
  socket.on('init', (msg) => {
    console.log(msg);
  });
  const { addPlayer } = usePlayerContext();
  // console.log(player);
  useEffect(() => {
    socket.off('get_currentPlayer').on('get_currentPlayer', (currentPlayer) => {
      console.log({ currentPlayer });
    });

    socket.off('player_join_room').on('player_join_room', (newPlayer) => {
      console.log({ newPlayer });
      // addPlayer(newPlayer);
    });

    socket.off('all_player_in_room').on('all_player_in_room', (msg) => {
      console.log({ msg });
      msg.forEach((player) => addPlayer(player));
    });
  }, []);

  return (
    <div className='canvas_container'>
      <RoomJoiningModal />
      <Canvas shadows={true}>
        <MyBox />
        <Lights />
        <MyPlane />
        <Model />
      </Canvas>
    </div>
  );
};

export default App;
