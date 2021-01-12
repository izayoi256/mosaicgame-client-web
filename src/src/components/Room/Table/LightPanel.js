import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Component = ({x: givenX, y: givenY, z: givenZ, shadowBias: givenShadowBias, onChange}) => {

  const [x, setX] = useState(givenX);
  const [y, setY] = useState(givenY);
  const [z, setZ] = useState(givenZ);
  const [shadowBias, setShadowBias] = useState(givenShadowBias);

  useEffect(() => {
    onChange({x, y, z, shadowBias});
  }, [onChange, x, y, z, shadowBias]);

  return (
    <div>
      <div>
        <label>
          Light X:
          <input type="number" value={x} onChange={(e) => setX(parseInt(e.target.value))} />
          {x}
        </label>
      </div>
      <div>
        <label>
          Light Y:
          <input type="number" value={y} onChange={(e) => setY(parseInt(e.target.value))} />
          {y}
        </label>
      </div>
      <div>
        <label>
          Light Z:
          <input type="number" value={z} onChange={(e) => setZ(parseInt(e.target.value))} />
          {z}
        </label>
      </div>
      <div>
        <label>
          Shadow Bias:
          <input type="number" value={shadowBias} step="0.0001" onChange={(e) => setShadowBias(parseFloat(e.target.value))} />
          {shadowBias}
        </label>
      </div>
    </div>
  );
};

Component.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Component;
