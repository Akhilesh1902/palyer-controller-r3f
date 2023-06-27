import React from 'react';
import { Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const MyPlane = () => {
  const [normalTexture, dispacementTexture, cityAO] = useTexture([
    './cityNormalMap2.png',
    './cityDisplacementMap.png',
    './cityAOMap.png',
  ]);

  return (
    <Plane
      receiveShadow={true}
      args={[64, 64, 128, 128]}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color={0x218a25}
        // roughness={1}
        // metalness={0}
        // wireframe
        side={THREE.DoubleSide}
        // map={'./cityNormalMap.jpg'}

        // aoMap={cityAO}
        // displacementMap={dispacementTexture}
        // displacementScale={2}
        // displacementBias={-1.5}
        // normalMap={normalTexture}
        // normalScale={10}
      />
    </Plane>
  );
};
