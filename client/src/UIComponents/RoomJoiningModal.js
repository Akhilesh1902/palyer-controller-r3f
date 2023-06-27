import React from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { SocketContext } from '../index';

const RoomJoiningModal = () => {
  const formRef = useRef();

  const socket = useContext(SocketContext);

  console.log(socket);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log('form Submitted');
    console.log(e.target.elements);
    const { playerName, roomId } = e.target.elements;
    socket.emit('player_join_room', {
      playerName: playerName.value,
      roomId: roomId.value,
      playerId: Math.floor(Math.random() * (12387473 * Math.random())),
      action: 'idle',
    });
  };

  return (
    <div className='room_joining_modal'>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className='room_joining_form'>
        <label htmlFor='playerName'>
          <span>PlayerName : </span>
          <input type='text' name='playerName' />
        </label>
        <label htmlFor='roomId'>
          <span>RoomID : </span>

          <input type='text' name='roomId' />
        </label>
        <button typeof='submit'>Join Room</button>
      </form>
    </div>
  );
};

export default RoomJoiningModal;
