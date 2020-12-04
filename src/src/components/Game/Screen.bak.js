import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';
import Game from './Game';

const Component = (props) => {

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);

  const fetchAndSetGame = async () => {
    const fetchedGame = await props.api.fetchGame();
    setGame(fetchedGame);
    setBoard(fetchedGame.board);
  };

  useEffect(fetchAndSetGame, []);

  const onCellClick = useCallback(async (index) => {
    console.log(`Cell ${index} was clicked!`);
    if (board[index] === 0) {
      await props.api.makeMove(index);
      fetchAndSetGame();
    }
  }, [board]);

  if (game === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Game {...{game, onCellClick}} />
    </div>
  );
};

Component.propTypes = {
  api: PropTypes.instanceOf(API).isRequired,
  user: PropTypes.shape({}).isRequired,
};

export default Component;
