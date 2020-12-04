import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';

const Component = ({api, me, gameId, onFetchingGameFailure}) => {

  const [game, setGame] = useState(null);
  const [gameChannel, setGameChannel] = useState(null);

  useEffect(() => {
    api.fetchGame()
      .then((fetchedGame) => {
        setGame(fetchedGame);
      })
      .catch((_) => {
        onFetchingGameFailure();
      });
    setGameChannel(api.subscribeGame(gameId));
    return () => api.unsubscribeGame(gameId);
  }, [gameId]);

  return (
    <div>
      <div>Game: {gameId}</div>
    </div>
  );
};

Component.propTypes = {
  api: PropTypes.instanceOf(API).isRequired,
  me: PropTypes.shape({}).isRequired,
  gameId: PropTypes.string.isRequired,
  onFetchingGameFailure: PropTypes.func.isRequired,
};

export default Component;
