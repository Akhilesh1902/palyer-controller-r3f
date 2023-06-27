import { useContext, useState } from 'react';
import { createContext } from 'react';

export const Context = createContext();

export const PlayerContext = ({ children }) => {
  const [_playerMap, setPlayerMap] = useState(new Map());
  const [_currentPlayer, _setCurrentPlayer] = useState();

  const setCurrentPlayer = (player) => {
    _setCurrentPlayer(player);
  };
  const getCurrentPlayer = () => {
    return _currentPlayer;
  };
  const addPlayer = (player) => {
    console.log(player);
    _playerMap.set(player.playerId, player);
    setPlayerMap((map) => new Map(map.set(player.playerId, player)));
  };

  const getPlayer = (playerId) => _playerMap.get(playerId);

  const updatePlayerPosition = (player) => {
    _playerMap.set(player.id, player);
  };

  const getAllPlayer = () => {
    return _playerMap;
  };

  return (
    <Context.Provider
      value={{
        addPlayer,
        getPlayer,
        updatePlayerPosition,
        getAllPlayer,
        setCurrentPlayer,
        getCurrentPlayer,
      }}>
      {children}
    </Context.Provider>
  );
};

export const usePlayerContext = () => useContext(Context);
