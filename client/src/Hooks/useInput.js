import React from 'react';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { SocketContext } from '../index';

const useInput = (playerId) => {
  const socket = useContext(SocketContext);

  //   console.log(socket);

  const [input, setInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    ShiftLeft: 'shift',
  };

  const findKey = (key) => keys[key];

  useEffect(() => {
    socket.emit('player_input', input);
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setInput((s) => ({ ...s, [findKey(e.code)]: true }));
    };
    const handleKeyUp = (e) => {
      setInput((s) => ({ ...s, [findKey(e.code)]: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return input;
};

export default useInput;
