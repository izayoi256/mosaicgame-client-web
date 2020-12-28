import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const Component = ({x, y, z, left, right, top, bottom, near, far, onChange, ...props}) => {

  const onChangeValue = useCallback((data) => onChange({
    x,
    y,
    z,
    left,
    right,
    top,
    bottom,
    near,
    far,
    ...props,
    ...data,
  }), [onChange, x, y, z, left, right, top, bottom, near, far, props]);

  return (
    <div>
      <div>
        <label>
          X:
          <input type="number" value={x} onChange={(e) => onChangeValue({x: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Y:
          <input type="number" value={y} onChange={(e) => onChangeValue({y: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Z:
          <input type="number" value={z} onChange={(e) => onChangeValue({z: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Left:
          <input type="number" value={left} onChange={(e) => onChangeValue({left: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Right:
          <input type="number" value={right} onChange={(e) => onChangeValue({right: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Top:
          <input type="number" value={top} onChange={(e) => onChangeValue({top: parseInt(e.target.value)})} />
        </label>
      </div>
      <div>
        <label>
          Bottom:
          <input type="number" value={bottom} onChange={(e) => onChangeValue({bottom: parseInt(e.target.value)})} />
        </label>
      </div>
    </div>
  );
};

Component.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
  bottom: PropTypes.number,
  near: PropTypes.number,
  far: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default Component;
