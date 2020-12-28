import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Component = ({x, y, z, ...props}) => {

  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.position.x = x;
    ref.current.position.y = y;
    ref.current.position.z = z;
    ref.current.shadow.camera.right = 200;
    ref.current.shadow.camera.left = -200;
    ref.current.shadow.camera.top = -200;
    ref.current.shadow.camera.bottom = 200;

  }, [ref, x, y, z]);

  return (
    <directionalLight
      {...props}
      ref={ref}
      castShadow
    />
  );
};

Component.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
};

export default Component;
