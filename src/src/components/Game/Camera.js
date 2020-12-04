import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import { Vector3 } from 'three';

export default (props) => {

  const ref = useRef();
  const {setDefaultCamera} = useThree();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setDefaultCamera(ref.current);
    ref.current.position.x = props.x;
    ref.current.position.y = props.y;
    ref.current.position.z = props.z;
    ref.current.zoom = props.zoom;
    ref.current.lookAt(new Vector3(0, 0, 0));
    ref.current.updateProjectionMatrix();
  }, [ref, setDefaultCamera, props.x, props.y, props.z, props.zoom]);

  return (
    <orthographicCamera
      {...props}
      ref={ref}
    />
  );
};