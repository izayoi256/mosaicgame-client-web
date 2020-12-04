import { cellRadius } from './Cell';
import PropTypes from 'prop-types';

export const boardHeight = 10;
const boardY = boardHeight * -0.5;

const Component = ({size}) => {
  const boardRadius = cellRadius * (size + 1);
  const boardWidth = boardRadius * 2;
  const boardDepth = boardRadius * 2;
  const color = 0xDEB887;
  return (
    <mesh
      position={[0, boardY, 0]}
      receiveShadow
    >
      <boxBufferGeometry args={[boardWidth, boardHeight, boardDepth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

Component.propTypes = {
  size: PropTypes.number.isRequired,
};

export default Component;
