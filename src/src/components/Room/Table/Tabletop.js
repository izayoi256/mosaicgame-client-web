import PropTypes from 'prop-types';

export const tableWidth = 1000;
export const tableHeight = 20;
export const tableDepth = 1000;

const Component = ({position = [0, 0, 0]}) => {
  return (
    <mesh
      {...{
        position,
      }}
      receiveShadow
    >
      <boxBufferGeometry args={[tableWidth, tableHeight, tableDepth]} />
      <meshStandardMaterial color={0xCCCCCC} />
    </mesh>
  );
};

Component.propTypes = {
  position: PropTypes.array,
};

export default Component;
