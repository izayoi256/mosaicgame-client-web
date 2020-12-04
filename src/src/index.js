import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ApiContext, MeContext } from './contexts';
import API from './api';
import { Entry, Lobby, Room } from './components/Screens';
import { GlobeAlt } from './components/Icons';
import './styles/tailwind.compiled.css';

const guestApi = new API();

const App = () => {

  const [token, setToken] = useState(Cookies.get('token') ?? null);
  const [api, setApi] = useState(guestApi);
  const [me, setMe] = useState(null);
  const [meChannel, setMeChannel] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const onFetchingRoomFailure = () => setRoomId(null);

  useEffect(() => {
    if (token === null) {
      Cookies.remove('token');
      setApi(guestApi);
    } else {
      Cookies.set('token', token);
      setApi(new API(token));
    }
  }, [token]);

  useEffect(() => {
    setMe(null);
    if (api !== guestApi) {
      setLoadingMe(true);
      api.fetchMe()
        .then((fetchedMe) => {
          setMe(fetchedMe);
        })
        .catch((_) => {
          setToken(null);
        })
        .finally(() => {
          setLoadingMe(false);
        });
    }
  }, [api]);

  useEffect(() => {
    if (api !== guestApi && me !== null && me.id != null) {
      setMeChannel(api.subscribeUser(me.id));
      return () => api.unsubscribeUser(me.id);
    } else {
      setMeChannel(null);
    }
  }, [api, me]);

  useEffect(() => {
    const newRoomId = me && (me.room_id ?? null);
    setRoomId(newRoomId);
  }, [me]);

  useEffect(() => {
    if (meChannel !== null) {
      meChannel.bind('room.joined', (response) => setRoomId(response.room.id));
      meChannel.bind('room.left', () => setRoomId(null));
    }
  }, [meChannel]);

  const onLogoutSubmit = () => setToken(null);

  const showEntryScreen = (token === null);
  const showLobbyScreen = me && (roomId === null);
  const showRoomScreen = me && (roomId !== null);
  const showMePanel = !!me;

  return (
    <div className="background">
      <ApiContext.Provider value={api}>
        <MeContext.Provider value={me}>
          {loadingMe && (
            <div className="overlay flex cursor-wait">
              <div className="m-auto">
                <div className="bg-opacity-80 bg-white rounded p-4">
                  <GlobeAlt className="animate-ping absolute w-8 h-8 opacity-75" />
                  <GlobeAlt className="w-8 h-8 mr-3" />
                  <span className="align-middle">プレイヤー情報をロード中...</span>
                </div>
              </div>
            </div>
          )}
          {showMePanel && (
            <div className="fixed">
              {me.name}
              <form onSubmit={onLogoutSubmit}>
                <button>退出</button>
              </form>
            </div>
          )}
          {showEntryScreen && (
            <Entry onTokenFetched={(newToken) => setToken(newToken ?? null)} />
          )}
          {showLobbyScreen && (
            <Lobby />
          )}
          {showRoomScreen && (
            <Room
              {...{
                api,
                me,
                roomId,
                onFetchingRoomFailure,
              }}
            />
          )}
        </MeContext.Provider>
      </ApiContext.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementsByTagName('body')[0]);
