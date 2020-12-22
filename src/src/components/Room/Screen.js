import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import { ApiContext, MeContext } from '../../contexts';
import { Exclamation, Login, Logout } from '../Icons';
import RoomForm from './RoomForm';

const Component = ({roomId, onFetchingRoomFailure}) => {

  const me = useContext(MeContext);
  const api = useContext(ApiContext);
  const [room, setRoom] = useState(null);
  const [roomChannel, setRoomChannel] = useState(null);
  const [fetchingRoomFailed, setFetchingRoomFailed] = useState(false);
  const [game, setGame] = useState(null);
  const [users, setUsers] = useState({});
  const [onlineMembers, setOnlineMembers] = useState({});
  const [showKickPrompt, setShowKickPrompt] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const targetUser = users[targetUserId] ?? null;
  // const [gameId, setGameId] = useState(null);
  // const gameStartable = true;

  const onlineMemberIds = Object.values(onlineMembers).map((member) => member.id);
  const userList = Object.values(users).sort(function (a, b) {
    const aIsOnline = onlineMemberIds.includes(a.id);
    const bIsOnline = onlineMemberIds.includes(b.id);
    if (a.id === me.id || (aIsOnline && !bIsOnline)) {
      return -1;
    }
    if (b.id === me.id || (!aIsOnline && bIsOnline)) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    if (roomChannel !== null && room !== null) {
      roomChannel.bind('size.updated', (response) => {
        setRoom({
          ...room,
          size: response.size,
        });
      });
      roomChannel.bind('players.updated', (response) => {
        setRoom({
          ...room,
          players: response.players,
        });
      });
      return () => {
        roomChannel.unbind('size.updated');
        roomChannel.unbind('players.updated');
      };
    }
  }, [roomChannel, room]);

  useEffect(() => {
    if (roomChannel !== null) {
      roomChannel.bind('room.joined', (response) => {
        setUsers({
          ...users,
          [response.user.id]: response.user,
        });
      });
      return () => roomChannel.unbind('room.joined');
    }
  }, [roomChannel, users]);

  useEffect(() => {
    if (roomChannel !== null) {
      roomChannel.bind('room.left', (response) => {
        const newUsers = {...users};
        delete newUsers[response.user.id];
        setUsers(newUsers);
      });
      return () => roomChannel.unbind('room.left');
    }
  }, [roomChannel, users]);

  useEffect(() => {
    if (roomChannel !== null) {
      roomChannel.bind('pusher:subscription_succeeded', (data) => {
        setOnlineMembers(data.members);
      });
      return () => roomChannel.unbind('pusher:subscription_succeeded');
    }
  }, [roomChannel]);

  useEffect(() => {
    if (roomChannel !== null) {
      roomChannel.bind('pusher:member_added', (member) => {
        setOnlineMembers({
          ...onlineMembers,
          [member.id]: member.info,
        });
      });
      return () => roomChannel.unbind('pusher:member_added');
    }
  }, [roomChannel, onlineMembers]);

  useEffect(() => {
    if (roomChannel !== null) {
      roomChannel.bind('pusher:member_removed', (member) => {
        const newOnlineMembers = {...onlineMembers};
        delete newOnlineMembers[member.id];
        setOnlineMembers(newOnlineMembers);
      });
      return () => roomChannel.unbind('pusher:member_removed');
    }
  }, [roomChannel, onlineMembers]);

  useEffect(() => {
    setFetchingRoomFailed(false);
    api.fetchRoom(roomId)
      .then((fetchedRoom) => {
        setRoom(fetchedRoom);
        setUsers(
          Object.fromEntries(fetchedRoom.users.map((user) => [user.id, user])),
        );
        // setGameId(fetchedRoom.game_id);
      })
      .catch((_) => {
        setFetchingRoomFailed(true);
      });
    setRoomChannel(api.subscribeRoom(roomId));
    return () => api.unsubscribeRoom(roomId);
  }, [api, roomId]);

  return (
    <div className="h-full flex">
      {room === null && (
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
      {(room !== null) && (
        <div className="w-full h-full overflow-auto flex flex-col sm:flex-row">
          <div className="w-full h-1/2 sm:w-1/2 sm:h-full bg-white">
            <Table
              game={game}
            />
          </div>
          <div className="w-full h-1/2 sm:w-1/2 sm:h-full overflow-y-auto p-2 flex flex-col">
            <div className="sm:h-3/5">
              <div className="sm:h-full sm:overflow-y-auto rounded bg-opacity-80 bg-white">
                <div className="p-2">
                  <RoomForm
                    onSubmit={(data) => api.editRoom(roomId, data)}
                    room={room}
                    users={userList}
                  />
                  <div>
                    <button className="btn py-2 px-4" onClick={() => api.leaveRoom()}>退室</button>
                    <button className="btn py-2 px-4" onClick={() => api.startGame(roomId)}>対局開始</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 sm:h-2/5">
              <div className="sm:h-full sm:overflow-y-auto rounded bg-opacity-80 bg-white">
                <ul>
                  {userList.map((user) => (
                    <li className="flex px-2 py-0.5 border-b first:rounded-t last:rounded-b last:border-0 border-gray-500 border-opacity-80 hover:bg-white">
                      <span className={`w-2 h-2 mr-2 inline-flex my-auto rounded-full ${onlineMembers.hasOwnProperty(user.id) ? 'bg-green-500' : 'bg-gray-500'}`}>&nbsp;</span>
                      <span className="align-middle">{user.name}</span>
                      {user.id !== me.id && (
                        <Logout className="ml-auto my-auto w-5 h-5 cursor-pointer text-gray-400 hover:text-current" title="キック" onClick={() => setTargetUserId(user.id) || setShowKickPrompt(true)} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {showKickPrompt && (targetUser !== null) && (
        <div className="overlay bg-opacity-30 bg-black flex">
          <div className="m-auto bg-white rounded p-4 text-xl font-medium">
            <div>
              <Logout className="w-8 h-8 mr-3" />
              <span className="align-middle">{targetUser.name}をキックしますか？</span>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="btn py-2 px-4" onClick={() => setShowKickPrompt(false) || setTargetUserId(null) || api.kickUser(roomId, targetUserId)}>OK</button>
              <button className="btn py-2 px-4" onClick={() => setShowKickPrompt(false) || setTargetUserId(null)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Component.propTypes = {
  roomId: PropTypes.string.isRequired,
  onFetchingRoomFailure: PropTypes.func.isRequired,
};

export default Component;
