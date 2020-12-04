import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Game from './Game';
import { ApiContext, MeContext } from '../../contexts';
import { Exclamation, Login } from '../Icons';

const Component = ({roomId, onFetchingRoomFailure}) => {

  const me = useContext(MeContext);
  const api = useContext(ApiContext);
  const [room, setRoom] = useState(null);
  const [roomChannel, setRoomChannel] = useState(null);
  const [fetchingRoomFailed, setFetchingRoomFailed] = useState(false);
  // const [onlineMembers, setOnlineMembers] = useState(null);
  // const [gameId, setGameId] = useState(null);
  // const gameStartable = true;
  //
  useEffect(() => {
    setFetchingRoomFailed(false);
    api.fetchRoom(roomId)
      .then((fetchedRoom) => {
        setRoom(fetchedRoom);
        // setGameId(fetchedRoom.game_id);
      })
      .catch((_) => {
        setFetchingRoomFailed(true);
      });
    setRoomChannel(api.subscribeRoom(roomId));
    return () => api.unsubscribeRoom(roomId);
  }, [api, roomId]);

  useEffect(() => {
    if (roomChannel !== null) {
      // roomChannel.bind('game.mounted', (response) => setGameId(response.gameId));
      // roomChannel.bind('game.unmounted', (_) => setGameId(null));
    }
  }, [roomChannel]);
  //
  // useEffect(() => {
  //   if (roomChannel !== null) {
  //     const onSubscriptionSucceeded = (data) => {
  //       setOnlineMembers(
  //         Object.entries(data.members).map(([_, member]) => member),
  //       );
  //     };
  //     const onMemberAdded = (member) => {
  //       setOnlineMembers([
  //         ...(onlineMembers ?? []),
  //         member.info,
  //       ]);
  //     };
  //     const onMemberRemoved = (member) => {
  //       setOnlineMembers(
  //         (onlineMembers ?? []).filter((onlineUser) => (onlineUser.id !== member.info.id)),
  //       );
  //     };
  //     roomChannel.bind('pusher:subscription_succeeded', onSubscriptionSucceeded);
  //     roomChannel.bind('pusher:member_added', onMemberAdded);
  //     roomChannel.bind('pusher:member_removed', onMemberRemoved);
  //     return () => {
  //       roomChannel.unbind('pusher:subscription_succeeded', onSubscriptionSucceeded);
  //       roomChannel.unbind('pusher:member_added', onMemberAdded);
  //       roomChannel.unbind('pusher:member_removed', onMemberRemoved);
  //     };
  //   }
  // }, [roomChannel, onlineMembers]);
  //
  // if (fetchingRoomFailed) {
  //   return (
  //     <div>
  //       <div>
  //         部屋情報のロードに失敗しました。
  //       </div>
  //       <div>
  //         <button onClick={onFetchingRoomFailure}>OK</button>
  //       </div>
  //     </div>
  //   );
  // }
  //
  // if (room === null) {
  //   return <div>部屋情報をロード中...</div>;
  // }
  //

  return (
    <div className="h-full flex">
      {!room && (
        <div className="m-auto">
          <div className="bg-opacity-80 bg-white rounded p-4">
            {fetchingRoomFailed && (
              <div>
                <Exclamation className="w-8 h-8 mr-3" />
                <span className="align-middle">部屋情報のロードに失敗しました。</span>
              </div>
            )}
            {!fetchingRoomFailed && (
              <div>
                <Login className="animate-ping absolute w-8 h-8 opacity-75" />
                <Login className="w-8 h-8 mr-3" />
                <span className="align-middle">部屋情報をロード中...</span>
              </div>
            )}
            <div
              className={`overlay ${fetchingRoomFailed ? 'cursor-pointer' : 'cursor-wait'}`}
              onClick={() => fetchingRoomFailed && onFetchingRoomFailure()}
            >
            </div>
          </div>
        </div>
      )}
      {/*<div>*/}
      {/*  {room.name}*/}
      {/*</div>*/}
      {/*{(onlineMembers !== null) && (*/}
      {/*  <ul>*/}
      {/*    {onlineMembers.map((onlineUser) => (*/}
      {/*      <li key={onlineUser.id}>*/}
      {/*        {onlineUser.name}*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*)}*/}
      {/*{(onlineMembers === null) && (*/}
      {/*  <div>*/}
      {/*    メンバー情報をロード中...*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{(gameId !== null) && (*/}
      {/*  <Game*/}
      {/*    {...{*/}
      {/*      gameId,*/}
      {/*    }}*/}
      {/*    onFetchingGameFailure={() => setGameId(null)}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{gameStartable && (*/}
      {/*  <div>*/}
      {/*    <button onClick={() => api.startGame(roomId)}>対局開始</button>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*<div>*/}
      {/*  <button onClick={() => api.leaveRoom()}>退室</button>*/}
      {/*</div>*/}
    </div>
  );
};

Component.propTypes = {
  roomId: PropTypes.string.isRequired,
  onFetchingRoomFailure: PropTypes.func.isRequired,
};

export default Component;
