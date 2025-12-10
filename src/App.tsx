import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import type { CharacterConfig } from './components/CharacterAvatar';

function App() {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({ type: 'mole' });

  const handleStartGame = (config: CharacterConfig) => {
    setCharacterConfig(config);
    setScreen('game');
  };

  const handleExitGame = () => {
    setScreen('menu');
  };

  return (
    <>
      {screen === 'menu' && <MainMenu onStart={handleStartGame} />}
      {screen === 'game' && (
        <Game
          characterConfig={characterConfig}
          onExit={handleExitGame}
        />
      )}
    </>
  );
}

export default App;
