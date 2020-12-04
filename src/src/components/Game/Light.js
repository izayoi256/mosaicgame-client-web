import React, { useEffect, useRef } from 'react';

export default (props) => {

  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.position.x = props.x;
    ref.current.position.y = props.y;
    ref.current.position.z = props.z;
    ref.current.shadow.camera.right = 200;
    ref.current.shadow.camera.left = -200;
    ref.current.shadow.camera.top = -200;
    ref.current.shadow.camera.bottom = 200;

  }, [ref, props.x, props.y, props.z]);

  return (
    <directionalLight
      {...props}
      ref={ref}
      castShadow
    />
  );
};