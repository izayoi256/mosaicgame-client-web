import { cellRadius } from './Cell';
import PropTypes from 'prop-types';

export const boardHeight = 10;

const Component = ({size, position = [0, 0, 0]}) => {
  const boardRadius = cellRadius * (size + 1);
  const boardWidth = boardRadius * 2;
  const boardDepth = boardRadius * 2;
  const color = 0xDEB887;
  return (
    <mesh
      {...{position}}
      receiveShadow
    >
      <boxBufferGeometry args={[boardWidth, boardHeight, boardDepth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

Component.propTypes = {
  size: PropTypes.number.isRequired,
  position: PropTypes.array,
};

export default Component;
