import { useContext, useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import PropTypes from 'prop-types';
import { MeContext, GameContext } from '../../../contexts';

export const cellRadius = 15;
export const cellHeight = 8;

const stoneRadius = cellRadius * 0.9;
const stoneHeight = cellHeight;
const radialSegments = 24;

const firstStoneColor = 0xef4444;
const secondStoneColor = 0x22c55e;
const neutralStoneColor = 0x999999;
const legalStoneColor = 0xFFFFFF;

const StoneMesh = ({color, onClick, onFrame, position = [0, 0, 0], castShadow = true, receiveShadow = true, transparent = false, ...props}) => {
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
      {...props}
    >
      <cylinderBufferGeometry ref={geometry} args={[stoneRadius, stoneRadius, stoneHeight, radialSegments]} />
      <meshStandardMaterial ref={material} {...{color, transparent}} />
    </mesh>
  );
}

const FirstCell = ({onClick, position = [0, 0, 0]}) => {
  return <StoneMesh color={firstStoneColor} {...{onClick, position}} />
};

const SecondCell = ({onClick, position = [0, 0, 0]}) => {
  return <StoneMesh color={secondStoneColor} {...{onClick, position}} />
};

const NeutralCell = ({onClick, position = [0, 0, 0]}) => {
  return <StoneMesh color={neutralStoneColor} {...{onClick, position}} />
};

const LegalCell = ({onClick, position = [0, 0, 0]}) => {
  const game = useContext(GameContext);
  const [hover, setHover] = useState(false);
  const onFrame = (mesh, geometry, material) => {
    if (!material.current) {
      return;
    }
    if (hover) {
      material.current.opacity = 0.75;
      return;
    }
    const blinkPerSecond = 1.8;
    const degree = (new Date()).getTime() / 1000 * 180 * blinkPerSecond;
    const radian = degree * (Math.PI / 180);
    material.current.opacity = (Math.sin(radian) + 1) / 2 * 0.3 + 0.15;
  };
  let stoneColor = legalStoneColor;
  if (hover) {
    if (game.is_first_turn) {
      stoneColor = firstStoneColor;
    }
    if (game.is_second_turn) {
      stoneColor = secondStoneColor;
    }
  }
  return <StoneMesh
    color={stoneColor}
    transparent={true}
    castShadow={false}
    receiveShadow={false}
    onPointerOver={() => setHover(true)}
    onPointerOut={() => setHover(false)}
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

const Component = ({index, state, onClick: onCellClick, position = [0, 0, 0]}) => {
  const me = useContext(MeContext);
  const game = useContext(GameContext);
  const onClick = () => onCellClick(index);
  switch (state) {
    case 0:
      return (me !== null && game !== null && me.id === game.current_player_id && !game.is_over)
        ? <LegalCell {...{position, onClick}} />
        : <EmptyCell {...{position, onClick}} />;
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
  state: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  position: PropTypes.array,
};

export default Component;
