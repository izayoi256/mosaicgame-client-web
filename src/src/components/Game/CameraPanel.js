import React, { useEffect, useState } from 'react';

export default (props) => {

  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [z, setZ] = useState(props.z);
  const [zoom, setZoom] = useState(props.zoom);

  useEffect(() => {
    props.onChange({x, y, z, zoom});
  }, [x, y, z, zoom]);

  return (
    <div>
      <div>
        <label>
          X:
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
          {x}
        </label>
      </div>
      <div>
        <label>
          Y:
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} />
          {y}
        </label>
      </div>
      <div>
        <label>
          Z:
          <input type="number" value={z} onChange={(e) => setZ(e.target.value)} />
          {z}
        </label>
      </div>
      <div>
        <label>
          Zoom:
          <input type="number" step={0.1} value={zoom} onChange={(e) => setZoom(e.target.value)} />
          {zoom}
        </label>
      </div>
    </div>
  );
};