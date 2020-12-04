import React, { useEffect, useState } from 'react';

export default (props) => {

  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [z, setZ] = useState(props.z);

  useEffect(() => {
    props.onChange({x, y, z});
  }, [x, y, z]);

  return (
    <div>
      <div>
        <label>
          Light X:
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
          {x}
        </label>
      </div>
      <div>
        <label>
          Light Y:
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} />
          {y}
        </label>
      </div>
      <div>
        <label>
          Light Z:
          <input type="number" value={z} onChange={(e) => setZ(e.target.value)} />
          {z}
        </label>
      </div>
    </div>
  );
};