import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mole } from './components/Mole';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { GameOver } from './components/GameOver';

const GAME_DURATION = 30;
const MOLE_COUNT = 9;
const MIN_POP_INTERVAL = 500;
const MAX_POP_INTERVAL = 1500;
const MOLE_STAY_DURATION = 1000;

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('whack-a-mole-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moles, setMoles] = useState<boolean[]>(new Array(MOLE_COUNT).fill(false));
  const [hitMoles, setHitMoles] = useState<boolean[]>(new Array(MOLE_COUNT).fill(false));

  const timerRef = useRef<number | null>(null);
  const moleTimerRef = useRef<number | null>(null);

  const molesRef = useRef(moles);
  useEffect(() => { molesRef.current = moles; }, [moles]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setIsGameOver(false);
    setMoles(new Array(MOLE_COUNT).fill(false));
    setHitMoles(new Array(MOLE_COUNT).fill(false));
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whack-a-mole-highscore', score.toString());
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#90EE90', '#FFB6C1']
      });
    }

    if (timerRef.current) clearInterval(timerRef.current);
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
  }, [score, highScore]);

  const popRandomMole = useCallback(() => {
    if (!isPlaying) return;

    const currentMoles = molesRef.current;
    const emptyIndices = currentMoles
      .map((active, index) => active ? -1 : index)
      .filter(index => index !== -1);

    if (emptyIndices.length === 0) {
      const nextPopTime = Math.random() * (MAX_POP_INTERVAL - MIN_POP_INTERVAL) + MIN_POP_INTERVAL;
      moleTimerRef.current = setTimeout(popRandomMole, nextPopTime);
      return;
    }

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    setMoles(prev => {
      const newMoles = [...prev];
      newMoles[randomIndex] = true;
      return newMoles;
    });

    setTimeout(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[randomIndex] = false;
        return newMoles;
      });
      setHitMoles(prev => {
        const newHits = [...prev];
        newHits[randomIndex] = false;
        return newHits;
      });
    }, MOLE_STAY_DURATION);

    const nextPopTime = Math.random() * (MAX_POP_INTERVAL - MIN_POP_INTERVAL) + MIN_POP_INTERVAL;
    moleTimerRef.current = setTimeout(popRandomMole, nextPopTime);
  }, [isPlaying]);

  const handleWhack = (index: number) => {
    if (!moles[index] || hitMoles[index] || !isPlaying) return;

    setHitMoles(prev => {
      const newHits = [...prev];
      newHits[index] = true;
      return newHits;
    });

    setScore(prev => prev + 10);

    setTimeout(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[index] = false;
        return newMoles;
      });
      setHitMoles(prev => {
        const newHits = [...prev];
        newHits[index] = false;
        return newHits;
      });
    }, 200);

    confetti({
      particleCount: 15,
      spread: 30,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#90EE90'],
      scalar: 0.5
    });
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      popRandomMole();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    };
  }, [isPlaying, endGame, popRandomMole]);

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Sun and Clouds Background */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-sun-yellow rounded-full shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-bounce-slow" />
      <div className="absolute top-20 left-20 w-32 h-16 bg-white rounded-full opacity-80" />
      <div className="absolute top-32 left-32 w-20 h-10 bg-white rounded-full opacity-60" />

      {/* Grass Bottom */}
      <div className="absolute bottom-0 w-full h-1/3 bg-grass-green" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 text-outline drop-shadow-xl tracking-wider">
          WHACK-A-MOLE
        </h1>

        <ScoreBoard score={score} highScore={highScore} timeLeft={timeLeft} />

        <div className="relative p-8 bg-white/40 backdrop-blur-md rounded-3xl border-4 border-white shadow-xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {moles.map((isVisible, index) => (
              <div key={index} className="w-24 h-24 md:w-32 md:h-32">
                <Mole
                  isVisible={isVisible}
                  isHit={hitMoles[index]}
                  onHit={() => handleWhack(index)}
                />
              </div>
            ))}
          </div>

          <GameControls onStart={startGame} isPlaying={isPlaying} />
        </div>
      </div>

      <AnimatePresence>
        {isGameOver && (
          <GameOver
            score={score}
            highScore={highScore}
            onRestart={startGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
