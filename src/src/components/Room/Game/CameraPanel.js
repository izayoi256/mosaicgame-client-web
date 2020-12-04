import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Component = ({x: givenX, y: givenY, z: givenZ, zoom: givenZoom, onChange}) => {

  const [x, setX] = useState(givenX);
  const [y, setY] = useState(givenY);
  const [z, setZ] = useState(givenZ);
  const [zoom, setZoom] = useState(givenZoom);

  useEffect(() => {
    onChange({x, y, z, zoom});
  }, [x, y, z, zoom]);

  return (
    <div>
      <div>
        <label>
          X:
          <input type="number" value={x} onChange={(e) => setX(parseInt(e.target.value))} />
          {x}
        </label>
      </div>
      <div>
        <label>
          Y:
          <input type="number" value={y} onChange={(e) => setY(parseInt(e.target.value))} />
          {y}
        </label>
      </div>
      <div>
        <label>
          Z:
          <input type="number" value={z} onChange={(e) => setZ(parseInt(e.target.value))} />
          {z}
        </label>
      </div>
      <div>
        <label>
          Zoom:
          <input type="number" step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
          {zoom}
        </label>
      </div>
    </div>
  );
};

Component.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Component;
