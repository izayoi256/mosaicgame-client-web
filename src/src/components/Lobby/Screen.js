import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../contexts';
import RoomCreationForm from './RoomCreationForm';
import JoinRoomForm from './JoinRoomForm';
import { Login, Refresh, PlusCircle, Exclamation, Key } from '../Icons';

const Component = () => {

  const api = useContext(ApiContext);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomCreationFailed, setRoomCreationFailed] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [searchingRooms, setSearchingRooms] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [joiningRoomFailed, setJoiningRoomFailed] = useState(false);
  const [showRoomCreationForm, setShowRoomCreationForm] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const onSubmitRoomCreation = useCallback((data) => {
    if (creatingRoom) {
      return;
    }
    setCreatingRoom(true);
    setRoomCreationFailed(false);
    api.createRoom(data)
      .catch((_) => {
        setCreatingRoom(false);
        setRoomCreationFailed(true);
      });
  }, [api, creatingRoom]);

  const searchRooms = useCallback(() => {
    if (searchingRooms) {
      return;
    }
    setRooms(null);
    setSearchingRooms(true);
    api.searchRooms()
      .then((foundRooms) => {
        setRooms(foundRooms);
      })
      .finally(() => {
        setSearchingRooms(false);
      })
  }, [api, searchingRooms]);

  useEffect(searchRooms, []);

  const joinRoom = useCallback((roomId, {password = null}) => {
    if (joiningRoom) {
      return;
    }
    setJoiningRoom(true);
    setJoiningRoomFailed(false);
    api.joinRoom(roomId, password)
      .catch((_) => {
        setJoiningRoomFailed(true);
        setJoiningRoom(false);
      });
  }, [api, joiningRoom]);

  const showOverlay = showRoomCreationForm || joiningRoom || joiningRoomFailed;

  return (
    <div className="h-full whitespace-nowrap overflow-y-scroll">
      <div className="flex">
        <div className="mx-auto">
          <ul className="rooms">
            <li
              key={-1}
              className="mb-4 flex"
            >
              <div
                className="w-70 h-24 p-2 border bg-white flex opacity-70 cursor-pointer hover:opacity-100"
                onClick={() => setShowRoomCreationForm(true)}
              >
                <div className="my-auto">
                  <PlusCircle className="w-10 h-10 mr-3" />
                  <span className="align-middle text-2xl font-medium">新しい部屋を作る</span>
                </div>
              </div>
              <div className={`w-24 h-24 p-2 ml-2 border bg-white flex opacity-70 hover:opacity-100 ${searchingRooms ? 'cursor-wait' : 'cursor-pointer'}`} onClick={searchRooms}>
                <div className="m-auto text-center">
                  <Refresh className={`w-16 h-16 ${searchingRooms ? 'animate-spin ' : ''}`} />
                </div>
              </div>
            </li>
            {(rooms !== null) && rooms.map((room) => (
              <li
                key={room.id}
                className={`room relative ${room.id === selectedRoomId ? 'selected' : ''}`}
              >
                <div
                  className="flex flex-col w-full"
                  onClick={() => setSelectedRoomId(
                    room.id === selectedRoomId
                      ? null
                      : room.id,
                  )}
                >
                  <div className="p-2">
                    {room.name}
                  </div>
                  <div className="mt-auto grid grid-cols-4">
                    <div className="p-0.5">
                      盤面:{`${room.size}×${room.size}`}
                    </div>
                  </div>
                </div>
                <div className={`absolute right-0 top-0 flex h-full`}>
                  <div className={`p-0.5 flex bg-yellow-400 ${room.requires_password ? 'visible' : 'invisible'}`}>
                    <Key className="w-5 h-5 text-white m-auto" />
                  </div>
                  <div className={`flex transition-all duration-300 overflow-hidden ${room.id === selectedRoomId ? 'w-48' : 'w-0'}`}>
                    <div className="m-auto w-full">
                      <JoinRoomForm onSubmit={(data) => joinRoom(room.id, data)} requiresPassword={room.requires_password} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showOverlay && (
        <div className="overlay bg-opacity-30 bg-black">
          {showRoomCreationForm && (
            <div className={`flex h-full ${roomCreationFailed ? 'hidden' : ''}`}>
              <div className="overlay cursor-pointer" onClick={() => !creatingRoom && setShowRoomCreationForm(false)} />
              <div className="m-auto bg-white rounded p-4 z-10">
                <RoomCreationForm onSubmit={onSubmitRoomCreation} submitting={creatingRoom} />
              </div>
            </div>
          )}
          {roomCreationFailed && (
            <div className="flex h-full cursor-pointer" onClick={() => setRoomCreationFailed(false)}>
              <div className="m-auto bg-white rounded p-4 text-xl font-medium">
                <Exclamation className="w-8 h-8 mr-3" />
                <span className="align-middle">部屋の作成に失敗しました。</span>
              </div>
            </div>
          )}
          {joiningRoom && (
            <div className="flex h-full">
              <div className="m-auto bg-white rounded p-4 text-xl font-medium">
                <Login className="animate-ping absolute w-8 h-8 opacity-75" />
                <Login className="w-8 h-8 mr-3" />
                <span className="align-middle">入室中...</span>
              </div>
            </div>
          )}
          {joiningRoomFailed && (
            <div className="flex h-full cursor-pointer" onClick={() => setJoiningRoomFailed(false)}>
              <div className="m-auto bg-white rounded p-4 text-xl font-medium">
                <Exclamation className="w-8 h-8 mr-3" />
                <span className="align-middle">入室に失敗しました。</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Component.propTypes = {};

export default Component;
