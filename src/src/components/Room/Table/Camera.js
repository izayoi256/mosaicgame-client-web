import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import { Vector3 } from 'three';
import PropTypes from 'prop-types';

const Component = ({x, y, z, ...props}) => {

  const camera = useRef();
  const {setDefaultCamera, aspect} = useThree();

  useEffect(() => {
    if (!camera.current) {
      return;
    }
    camera.current.left = (props.left != null)
      ? props.left * Math.max(aspect, 1)
      : camera.current.left;
    camera.current.right = (props.right != null)
      ? props.right * Math.max(aspect, 1)
      : camera.current.right;
    camera.current.top = (props.top != null)
      ? props.top / Math.min(aspect, 1)
      : camera.current.top;
    camera.current.bottom = (props.bottom != null)
      ? props.bottom / Math.min(aspect, 1)
      : camera.current.bottom;
    camera.current.updateProjectionMatrix();
  }, [camera, aspect, props]);

  useEffect(() => {
    if (!camera.current) {
      return;
    }
    setDefaultCamera(camera.current);
  }, [camera, setDefaultCamera]);

  useEffect(() => {
    if (!camera.current) {
      return;
    }
    camera.current.position.x = x ?? camera.current.position.x;
    camera.current.position.y = y ?? camera.current.position.y;
    camera.current.position.z = z ?? camera.current.position.z;
    camera.current.lookAt(new Vector3(0, 0, 0));
    camera.current.updateProjectionMatrix();
  }, [camera, x, y, z]);

  return (
    <orthographicCamera
      {...props}
      ref={camera}
    />
  );
};

Component.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
};

export default Component;
