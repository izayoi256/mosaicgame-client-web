import Pusher from 'pusher-js';

const pusherAppKey = 'a96e39617eb66d298866';
// TODO
Pusher.logToConsole = true;

class Api {
  baseUrl;
  size;
  token;
  board;
  playerIndex;
  pusher;

  constructor(token = null) {
    // TODO
    this.baseUrl = 'http://localhost:8280/api';
    this.size = 3;
    this.token = token;
    this.playerIndex = 0;
    this.board = Array(this.size).fill(null).map((v, k) => k).reduce((board, next) => {
      const length = Math.pow(next + 1, 2);
      board.push(...Array(length).fill(-1));
      return board;
    }, []);
    this.board.pop();
    this.board.pop();
    this.board.push(0);
    this.board.push(3);

    let pusherConfig = {
        // TODO
        cluster: 'ap3',
        forceTLS: true,
      }
    ;

    if (token !== null) {
      pusherConfig = {
        ...pusherConfig,
        // TODO
        authEndpoint: 'http://localhost:8280/broadcasting/auth',
        authTransport: 'ajax',
        auth: {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      }
    }

    this.pusher = new Pusher(pusherAppKey, pusherConfig);
  }

  async entry(name) {
    const response = await this.request('/entry', {
      method: 'POST',
      body: {
        name,
      },
    });
    if (!response.ok) {
      throw new Error('API Error: "entry" failed.');
    }
    const json = await response.json();
    return json.token;
  }

  async fetchMe() {
    const response = await this.request('/me', {
      method: 'GET',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "fetchMe" failed.');
    }
    return await response.json();
  }

  async createRoom({name, size, password = null}) {
    const response = await this.request('/room', {
      method: 'POST',
      authenticate: true,
      body: {
        ...{
          name,
          size,
          password,
        },
      },
    });
    if (!response.ok) {
      throw new Error('API Error: "createRoom" failed.');
    }
  }

  async fetchRoom(roomId) {
    const response = await this.request(`/room/${roomId}`, {
      method: 'GET',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "fetchRoom" failed.');
    }
    return await response.json();
  }

  async leaveRoom() {
    const response = await this.request(`/me/room/leave`, {
      method: 'POST',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "leaveRoom" failed.');
    }
  }

  async searchRooms() {
    const response = await this.request(`/room`, {
      method: 'GET',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "searchRooms" failed.');
    }
    return await response.json();
  }

  async joinRoom(roomId, password = null) {
    const body = (password === null)
      ? {}
      : {
        password,
      };
    const response = await this.request(`/room/${roomId}/join`, {
      method: 'POST',
      authenticate: true,
      body,
    });
    if (!response.ok) {
      throw new Error('API Error: "joinRoom" failed.');
    }
  }

  async editRoom(roomId, {size, firstPlayer, secondPlayer}) {
    const body = {
      size,
      firstPlayer,
      secondPlayer,
    };
    const response = await this.request(`/room/${roomId}`, {
      method: 'PUT',
      authenticate: true,
      body,
    });
    if (!response.ok) {
      throw new Error('API Error: "editRoom" failed.');
    }
  }

  async kickUser(roomId, userId) {
    const response = await this.request(`/room/${roomId}/kick`, {
      method: 'POST',
      authenticate: true,
      body: {
        userId,
      },
    });
    if (!response.ok) {
      throw new Error('API Error: "kickUser" failed.');
    }
  }

  async startGame(roomId) {
    const response = await this.request(`/room/${roomId}/game/start`, {
      method: 'POST',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "startGame" failed.');
    }
  }

  async fetchGame(gameId) {
    const response = await this.request(`/game/${gameId}`, {
      method: 'GET',
      authenticate: true,
    });
    if (!response.ok) {
      throw new Error('API Error: "fetchGame" failed.');
    }
    return await response.json();
  }

  async makeMove(gameId, cell) {
    const response = await this.request(`/game/${gameId}/move`, {
      method: 'POST',
      authenticate: true,
      body: {
        cell,
      },
    });
    if (!response.ok) {
      throw new Error('API Error: "makeMove" failed.');
    }
  }

  async request(path, {method = 'GET', query = {}, body = {}, headers = {}, authenticate = false}) {
    const queryString = Object.keys(query).map((k) => `${encodeURI(k)}=${encodeURI(query[k] ?? '')}`).join('&');
    const url = this.baseUrl + path + '?' + queryString;
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    };

    if (authenticate) {
      headers = {
        'Authorization': `Bearer ${this.token ?? ''}`,
        ...headers,
      };
    }

    method = method.toUpperCase();
    const parameters = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      parameters.body = (typeof body === 'string')
        ? body
        : JSON.stringify(body);
    }

    return await fetch(url, parameters);
  }

  subscribeUser(userId) {
    return this.subscribePrivate(`user.${userId ?? ''}`);
  }

  unsubscribeUser(userId) {
    return this.unsubscribePrivate(`user.${userId ?? ''}`);
  }

  subscribeRoom(roomId) {
    return this.subscribePresence(`room.${roomId ?? ''}`);
  }

  unsubscribeRoom(roomId) {
    return this.unsubscribePresence(`room.${roomId ?? ''}`);
  }

  subscribeGame(gameId) {
    return this.subscribePresence(`game.${gameId ?? ''}`);
  }

  unsubscribeGame(gameId) {
    return this.unsubscribePresence(`game.${gameId ?? ''}`);
  }

  subscribe(channelName) {
    return this.pusher.subscribe(channelName);
  }

  unsubscribe(channelName) {
    return this.pusher.unsubscribe(channelName);
  }

  subscribePrivate(channelName) {
    return this.subscribe(`private-${channelName ?? ''}`);
  }

  unsubscribePrivate(channelName) {
    return this.pusher.unsubscribe(`private-${channelName ?? ''}`);
  }

  subscribePresence(channelName) {
    return this.subscribe(`presence-${channelName ?? ''}`);
  }

  unsubscribePresence(channelName) {
    return this.pusher.unsubscribe(`presence-${channelName ?? ''}`);
  }
}

export default Api;
