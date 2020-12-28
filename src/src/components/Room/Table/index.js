import React, { useContext, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import PropTypes from 'prop-types';
import { GameContext, MeContext } from '../../../contexts';
import Board, { boardHeight } from './Board';
import Camera from './Camera';
import CameraPanel from './CameraPanel';
import Cells from './Cells';
import Light from './Light';
import LightPanel from './LightPanel';
import { cellHeight } from './Cell';

const ForwardCanvas = ({ children, ...props }) => {
  const game = useContext(GameContext);
  const me = useContext((MeContext));
  return (
    <Canvas
      {...props}
    >
      <GameContext.Provider value={game}>
        <MeContext.Provider value={me}>
          {children}
        </MeContext.Provider>
      </GameContext.Provider>
    </Canvas>
  )
};

const Component = ({onCellClick}) => {

  const game = useContext(GameContext);
  const [cameraProps, setCameraProps] = useState({
    x: 0,
    y: 150,
    z: 25,
    left: -150,
    right: 150,
    top: 150,
    bottom: -150,
  });
  const [lightProps, setLightProps] = useState({x: -20, y: 200, z: 75});

  return (
    <div className="w-full h-full flex flex-col">
      {/*<CameraPanel {...cameraProps} onChange={setCameraProps} />*/}
      {/*<LightPanel {...lightProps} onChange={setLightProps} />*/}
      <ForwardCanvas
        shadowMap={true}
        updateDefaultCamera={false}
      >
        <Camera {...cameraProps} />
        <Light {...lightProps} />
        {game && (
          <group position={[0, boardHeight * 0.5, 0]}>
            <Board size={game.size} />
            <Cells
              position={[0, cellHeight * 0.5, 0]}
              size={game.size}
              cells={game.board.map((v, k) => ({index: k, state: v}))}
              onCellClick={onCellClick}
            />
          </group>
        )}
      </ForwardCanvas>
    </div>
  );
};

Component.propTypes = {
  onCellClick: PropTypes.func.isRequired,
};

export default Component;
