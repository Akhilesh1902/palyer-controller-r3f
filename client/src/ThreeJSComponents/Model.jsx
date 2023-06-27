import { useContext, useEffect, useCallback, useState } from 'react';
import { useAnimations, useGLTF, OrbitControls } from '@react-three/drei';
import useInput from '../Hooks/useInput';
import { usePlayerContext } from '../Context/PlayerContext';
import { SocketContext } from '../index';
import { act, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Quaternion, Vector3 } from 'three';

const walkDirection = new Vector3();
const rotateAngle = new Vector3(0, 1, 0);
const rotateQuarternion = new Quaternion();
const cameraTarget = new Vector3();

const directionOffset = ({ forward, backward, left, right }) => {
  // console.log({ forward, backward, left, right });
  let directionOffset = 0; //2
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; //wa
    } else if (right) {
      directionOffset = -Math.PI / 4; //wd
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; //sa
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; //sd
    } else {
      directionOffset = Math.PI; //s
    }
  } else if (left) {
    directionOffset = Math.PI / 2; //a
  } else if (right) {
    directionOffset = -Math.PI / 2; //d
  }
  // console.log({ directionOffset });
  return directionOffset;
};

const Velocity = 0.03;

export const Model = ({ playerId }) => {
  const socket = useContext(SocketContext);
  // console.log(socket);
  const { addPlayer, getPlayer, updatePlayerPosition, getAllPlayer } =
    usePlayerContext();
  const { animations, scene } = useGLTF('./copper.glb');
  const { actions } = useAnimations(animations, scene);
  const { forward, backward, right, left, shift } = useInput(playerId);

  socket.on('player_join_room', (newPlayer) => {
    addPlayer(newPlayer);
  });

  const currentAction = useRef('');
  const controllerRef = useRef(null);
  const camera = useThree((state) => state.camera);

  const updateCameraTarget = (moveX, moveZ) => {
    camera.position.x += moveX;
    camera.position.z += moveZ;
    cameraTarget.x = scene.position.x;
    cameraTarget.y = scene.position.y;
    cameraTarget.z = scene.position.z;

    if (controllerRef.current) controllerRef.current.target = cameraTarget;
  };

  useEffect(() => {
    let action = 'Breathing Idle';
    if (backward || forward || left || right) {
      if (shift) {
        action = 'Pistol Run';
      } else {
        action = 'walking';
      }
      // console.log('here');
    }

    if (currentAction.current != action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  }, [backward, forward, left, right, shift]);

  useFrame((_, delta) => {
    // console.log(actions);
    if (
      currentAction.current === 'walking' ||
      currentAction.current === 'Pistol Run'
    ) {
      let angleYCameraDirection = Math.atan2(
        camera.position.x - scene.position.x,
        camera.position.z - scene.position.z
      );
      // console.log({ angleYCameraDirection });

      let newDirectionalOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });
      // console.log({ newDirectionalOffset });
      // console.log({ rotateAngle });
      // console.log({ angleYCameraDirection });
      // rotate model
      rotateQuarternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionalOffset
      );
      scene.quaternion.rotateTowards(rotateQuarternion, 0.2);

      // walk direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionalOffset);

      // console.log(walkDirection);
      // console.log(scene.quaternion);

      // run or walk velocity

      const Velocity = currentAction.current === 'Pistol Run' ? 10 : 3;

      // new Model and camera

      const moveX = walkDirection.x * Velocity * delta;
      const moveZ = walkDirection.z * Velocity * delta;
      scene.position.x += moveX;
      scene.position.z += moveZ;

      updateCameraTarget(moveX, moveZ);
      socket.emit('test_emit', 'msg');
    }
  });

  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return (
    <>
      <OrbitControls ref={controllerRef} />
      <primitive object={scene}></primitive>
    </>
  );
};
