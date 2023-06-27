import { useHelper } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { CameraHelper, DirectionalLightHelper, Vector2 } from 'three';

const DL_CAM_SIZE = 100;

export const Lights = () => {
  const dl = useRef();
  // useHelper(dl, DirectionalLightHelper);
  const data = useThree();
  console.log(data);
  // const camRef = dl.current?.shadow.camera;
  const camRef = useRef();

  useEffect(() => {
    if (dl.current) {
      camRef.current = dl.current.shadow.camera;
      console.log(dl.current);
      // dl.current.shadow.map.height = 1024;
      dl.current.shadow.mapSize = new Vector2(2048, 2048);
      // dl.current.shadow.camera.bottom = 10;
    }
  }, [dl]);

  useEffect(() => {
    console.log(camRef.current);
    camRef.current.top = +DL_CAM_SIZE;
    camRef.current.bottom = -DL_CAM_SIZE;
    camRef.current.left = +DL_CAM_SIZE;
    camRef.current.right = -DL_CAM_SIZE;
  }, [camRef]);

  useHelper(camRef, CameraHelper);
  console.log(dl.current);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={dl}
        intensity={0.7}
        position={[50, 50, 50]}
        castShadow
      />
    </>
  );
};
