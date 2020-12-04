import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';

export const cellWidth = 30;
export const cellHeight = 8;
export const cellDepth = 30;

const stoneRadius = cellWidth * 0.45;
const stoneHeight = cellHeight;
const radialSegments = 24;

const StoneMesh = (props) => {
  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
    >
      <cylinderBufferGeometry args={[stoneRadius, stoneRadius, stoneHeight, radialSegments]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

const LegalCellMesh = (props) => {
  const material = useRef();
  useFrame(() => {
    if (!material.current) {
      return;
    }
    const blinkPerSecond = 1.8;
    const degree = (new Date()).getTime() / 1000 * 180 * blinkPerSecond;
    const radian = degree * (Math.PI / 180);
    material.current.opacity = (Math.sin(radian) + 1) / 2 * 0.7 + 0.15;
  });
  return (
    <mesh {...props}>
      <cylinderBufferGeometry args={[stoneRadius, stoneRadius, stoneHeight, radialSegments]} />
      <meshStandardMaterial ref={material} color={0xFFFFFF} transparent />
    </mesh>
  );
}

const FirstDiscMesh = (props) => {
  return <StoneMesh color={0xFF0000} {...props} />
};

const SecondDiscMesh = (props) => {
  return <StoneMesh color={0x00FF00} {...props} />
};

const ThirdDiscMesh = (props) => {
  return <StoneMesh color={0x003366} {...props} />
};

const FourthDiscMesh = (props) => {
  return <StoneMesh color={0xFFFFFF} {...props} />
};

const NeutralDiscMesh = (props) => {
  return <StoneMesh color={0x999999} {...props} />
};

export default (props) => {
  let cell = null;
  switch (props.value) {
    case 0:
      cell = <LegalCellMesh {...props} onClick={() => props.onClick(props.index)} />
      break;
    case 1:
      cell = <FirstDiscMesh {...props} onClick={() => props.onClick(props.index)} />;
      break;
    case 2:
      cell = <SecondDiscMesh {...props} onClick={() => props.onClick(props.index)} />;
      break;
    case 3:
      cell = <ThirdDiscMesh {...props} onClick={() => props.onClick(props.index)} />;
      break;
    case 4:
      cell = <FourthDiscMesh {...props} onClick={() => props.onClick(props.index)} />;
      break;
    case 5:
      cell = <NeutralDiscMesh {...props} onClick={() => props.onClick(props.index)} />;
      break;
    case -1:
    default:
      break;
  }

  return cell;
};
