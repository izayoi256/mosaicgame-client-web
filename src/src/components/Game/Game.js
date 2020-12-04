import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
import Board from './Board';
import Camera from './Camera';
import Light from './Light';
import CameraPanel from './CameraPanel';
import LightPanel from './LightPanel';

const Component = (props) => {

  const [cameraProps, setCameraProps] = useState({x: 0, y: 250, z: 50, zoom: 0.5});
  const [lightProps, setLightProps] = useState({x: -20, y: 200, z: 75});

  return (
    <div>
      <CameraPanel {...cameraProps} onChange={(newCameraProps) => setCameraProps({...newCameraProps})} />
      <LightPanel {...lightProps} onChange={(newLightProps) => setLightProps({...newLightProps})} />
      <Canvas
        shadowMap={true}
      >

        <Light {...lightProps} />
        <Camera {...cameraProps} />

        <Board
          size={props.game.size}
          board={props.game.board}
          onCellClick={props.onCellClick}
        />
      </Canvas>
    </div>
  );
};

Component.propTypes = {
  game: PropTypes.shape({
    size: PropTypes.number.isRequired,
    board: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  onCellClick: PropTypes.func.isRequired,
};

export default Component;
