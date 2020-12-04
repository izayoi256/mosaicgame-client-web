import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from 'react-three-fiber';
import { ApiContext } from '../../../contexts';
import Board from './Board';
import Cells from './Cells';
import Camera from './Camera';
import CameraPanel from './CameraPanel';
import Light from './Light';
import LightPanel from './LightPanel';

const Component = ({gameId, onFetchingGameFailure}) => {

  const api = useContext(ApiContext);
  const [game, setGame] = useState(null);
  const [gameChannel, setGameChannel] = useState(null);
  const [makingMove, setMakingMove] = useState(false);

  const [cameraProps, setCameraProps] = useState({x: 0, y: 250, z: 50, zoom: 0.5});
  const [lightProps, setLightProps] = useState({x: -20, y: 200, z: 75});

  useEffect(() => {
    api.fetchGame(gameId)
      .then((fetchedGame) => {
        console.log(JSON.stringify(fetchedGame));
        setGame(fetchedGame);
      })
      .catch((_) => {
        onFetchingGameFailure();
      });
    setGameChannel(api.subscribeGame(gameId));
    return () => api.unsubscribeGame(gameId);
  }, [api, gameId, onFetchingGameFailure]);

  useEffect(() => {
    if (gameChannel !== null) {
      const onBoardChanged = (response) => {
        setGame({
          ...game,
          board: response.board,
        });
        setMakingMove(false);
      };
      const onCurrentPlayerChanged = (response) => {
        // TODO
        console.log(`Current player: ${response.currentPlayerId}`);
      };
      const onMoveMade = (response) => {
        // TODO
        console.log(`Move made: ${response.cell}`);
      };
      gameChannel.bind('board.changed', onBoardChanged);
      gameChannel.bind('currentPlayer.changed', onCurrentPlayerChanged);
      gameChannel.bind('move.made', onMoveMade);
      return () => {
        gameChannel.unbind('board.changed', onBoardChanged);
        gameChannel.unbind('currentPlayer.changed', onCurrentPlayerChanged);
        gameChannel.unbind('move.made', onMoveMade);
      };
    }
  }, [game, gameChannel]);

  const onCellClick = useCallback((cell) => {
    if (game !== null) {
      if (!makingMove && game.board[cell] === 0) {
        api.makeMove(gameId, cell)
          .catch((_) => {
            setMakingMove(false);
            // TODO
          });
        setMakingMove(true);
      }
    }
  }, [game, makingMove]);

  return (
    <div>
      <CameraPanel {...cameraProps} onChange={(newCameraProps) => setCameraProps({...newCameraProps})} />
      <LightPanel {...lightProps} onChange={(newLightProps) => setLightProps({...newLightProps})} />
      <Canvas
        shadowMap={true}
      >

        <Light {...lightProps} />
        <Camera {...cameraProps} />

        {game && (
          <group>
            <Board size={game.size} />
            <Cells
              size={game.size}
              cells={game.board.map((v, k) => ({index: k, value: v}))}
              onCellClick={onCellClick}
            />
          </group>
        )}

        {/*<Board*/}
        {/*  size={props.game.size}*/}
        {/*  board={props.game.board}*/}
        {/*  onCellClick={props.onCellClick}*/}
        {/*/>*/}
      </Canvas>
    </div>
  );
};

Component.propTypes = {
  gameId: PropTypes.string.isRequired,
  onFetchingGameFailure: PropTypes.func.isRequired,
};

export default Component;
