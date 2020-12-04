import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import PropTypes from 'prop-types';
import { cellWidth } from '../../Game/Cell';

export const cellRadius = 15;
export const cellHeight = 8;

const stoneRadius = cellWidth * 0.45;
const stoneHeight = cellHeight;
const radialSegments = 24;

const StoneMesh = ({color, position, onClick, onFrame, castShadow = true, receiveShadow = true, transparent = false}) => {
  const mesh = useRef();
  const geometry = useRef();
  const material = useRef();
  useFrame(() => {
    if (onFrame != null) {
      onFrame(mesh, geometry, material);
    }
  });
  return (
    <mesh
      ref={mesh}
      {...{
        position,
        onClick,
        castShadow,
        receiveShadow,
      }}
    >
      <cylinderBufferGeometry ref={geometry} args={[stoneRadius, stoneRadius, stoneHeight, radialSegments]} />
      <meshStandardMaterial ref={material} {...{color, transparent}} />
    </mesh>
  );
}

const FirstCell = ({onClick, position}) => {
  return <StoneMesh color={0xFF0000} {...{onClick, position}} />
};

const SecondCell = ({onClick, position}) => {
  return <StoneMesh color={0x00FF00} {...{onClick, position}} />
};

const NeutralCell = ({onClick, position}) => {
  return <StoneMesh color={0x999999} {...{onClick, position}} />
};

const LegalCell = ({onClick, position}) => {
  const onFrame = (mesh, geometry, material) => {
    if (!material.current) {
      return;
    }
    const blinkPerSecond = 1.8;
    const degree = (new Date()).getTime() / 1000 * 180 * blinkPerSecond;
    const radian = degree * (Math.PI / 180);
    material.current.opacity = (Math.sin(radian) + 1) / 2 * 0.3 + 0.15;
  };
  return <StoneMesh
    color={0xFFFFFF}
    transparent={true}
    castShadow={false}
    receiveShadow={false}
    {...{
      onClick,
      onFrame,
      position,
    }}
  />
};

const EmptyCell = () => {
  return null;
};

const Component = ({index, value, position, onClick: onCellClick}) => {
  const onClick = () => onCellClick(index);
  switch (value) {
    case 0:
      return <LegalCell {...{position, onClick}} />
    case 1:
      return <FirstCell {...{position, onClick}} />
    case 2:
      return <SecondCell {...{position, onClick}} />
    case 3:
      return <NeutralCell {...{position, onClick}} />
    default:
      return <EmptyCell {...{position, onClick}} />
  }
};

Component.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default Component;

