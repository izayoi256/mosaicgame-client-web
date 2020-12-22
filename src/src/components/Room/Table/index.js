import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';

const Component = ({game}) => {

  return (
    <Canvas
      shadowMap={true}
    >
    </Canvas>
  );

  return (
    <div>
      {/*<CameraPanel {...cameraProps} onChange={(newCameraProps) => setCameraProps({...newCameraProps})} />*/}
      {/*<LightPanel {...lightProps} onChange={(newLightProps) => setLightProps({...newLightProps})} />*/}
      {/*<Canvas*/}
      {/*  shadowMap={true}*/}
      {/*>*/}

      {/*  <Light {...lightProps} />*/}
      {/*  <Camera {...cameraProps} />*/}

      {/*  {game && (*/}
      {/*    <group>*/}
      {/*      <Board size={game.size} />*/}
      {/*      <Cells*/}
      {/*        size={game.size}*/}
      {/*        cells={game.board.map((v, k) => ({index: k, value: v}))}*/}
      {/*        onCellClick={onCellClick}*/}
      {/*      />*/}
      {/*    </group>*/}
      {/*  )}*/}

      {/*  /!*<Board*!/*/}
      {/*  /!*  size={props.game.size}*!/*/}
      {/*  /!*  board={props.game.board}*!/*/}
      {/*  /!*  onCellClick={props.onCellClick}*!/*/}
        {/*/>*/}
      {/*</Canvas>*/}
    </div>
  );
};

Component.propTypes = {
  game: PropTypes.shape({}),
};

export default Component;
