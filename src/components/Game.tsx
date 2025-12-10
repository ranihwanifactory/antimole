import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { Mole } from './Mole';
import { ScoreBoard } from './ScoreBoard';
import { GameOver } from './GameOver';
import { LevelComplete } from './LevelComplete';
import type { CharacterConfig } from './CharacterAvatar';

const MOLE_COUNT = 9;
const BASE_GAME_DURATION = 30;

interface LevelConfig {
    targetScore: number;
    minPopInterval: number;
    maxPopInterval: number;
    moleStayDuration: number;
}

const getLevelConfig = (level: number): LevelConfig => {
    // Difficulty scaling
    const speedMultiplier = Math.max(0.4, 1 - (level - 1) * 0.1); // Cap at 0.4x speed

    return {
        targetScore: level * 150, // Increase target by 150 each level
        minPopInterval: 500 * speedMultiplier,
        maxPopInterval: 1500 * speedMultiplier,
        moleStayDuration: 1000 * speedMultiplier,
    };
};

interface GameProps {
    characterConfig: CharacterConfig;
    onExit: () => void;
}

export const Game = ({ characterConfig, onExit }: GameProps) => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('whack-a-mole-highscore');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [timeLeft, setTimeLeft] = useState(BASE_GAME_DURATION);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameState, setGameState] = useState<'playing' | 'level-complete' | 'game-over'>('playing');

    const [moles, setMoles] = useState<boolean[]>(new Array(MOLE_COUNT).fill(false));
    const [hitMoles, setHitMoles] = useState<boolean[]>(new Array(MOLE_COUNT).fill(false));
    const [isMuted, setIsMuted] = useState(false);

    const timerRef = useRef<number | null>(null);
    const moleTimerRef = useRef<number | null>(null);
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const molesRef = useRef(moles);

    useEffect(() => { molesRef.current = moles; }, [moles]);

    // Initialize BGM
    useEffect(() => {
        bgmRef.current = new Audio('/bgm.mp3');
        bgmRef.current.loop = true;
        return () => {
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current = null;
            }
        };
    }, []);

    // Handle BGM
    useEffect(() => {
        const bgm = bgmRef.current;
        if (!bgm) return;

        if (isPlaying && !isMuted && gameState === 'playing') {
            bgm.play().catch(e => console.log('BGM play failed:', e));
        } else {
            bgm.pause();
        }
    }, [isPlaying, isMuted, gameState]);

    const startLevel = useCallback(() => {
        setTimeLeft(BASE_GAME_DURATION);
        setGameState('playing');
        setIsPlaying(true);
        setMoles(new Array(MOLE_COUNT).fill(false));
        setHitMoles(new Array(MOLE_COUNT).fill(false));
        if (bgmRef.current) bgmRef.current.currentTime = 0;
    }, []);

    // Start game on mount
    useEffect(() => {
        startLevel();
    }, [startLevel]);

    const handleLevelComplete = () => {
        setIsPlaying(false);
        setGameState('level-complete');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#90EE90', '#FFB6C1']
        });
    };

    const handleGameOver = useCallback(() => {
        setIsPlaying(false);
        setGameState('game-over');
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('whack-a-mole-highscore', score.toString());
        }
    }, [score, highScore]);

    const nextLevel = () => {
        setLevel(prev => prev + 1);
        startLevel();
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        startLevel();
    };

    const popRandomMole = useCallback(() => {
        if (!isPlaying || gameState !== 'playing') return;

        const config = getLevelConfig(level);
        const currentMoles = molesRef.current;
        const emptyIndices = currentMoles
            .map((active, index) => active ? -1 : index)
            .filter(index => index !== -1);

        if (emptyIndices.length === 0) {
            const nextPopTime = Math.random() * (config.maxPopInterval - config.minPopInterval) + config.minPopInterval;
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
        }, config.moleStayDuration);

        const nextPopTime = Math.random() * (config.maxPopInterval - config.minPopInterval) + config.minPopInterval;
        moleTimerRef.current = setTimeout(popRandomMole, nextPopTime);
    }, [isPlaying, gameState, level]);

    const handleWhack = (index: number) => {
        if (!moles[index] || hitMoles[index] || !isPlaying) return;

        setHitMoles(prev => {
            const newHits = [...prev];
            newHits[index] = true;
            return newHits;
        });

        setScore(prev => prev + 10);

        if (!isMuted) {
            const audio = new Audio('/ef.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
        }

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

    // Game Loop
    useEffect(() => {
        if (isPlaying && gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        const config = getLevelConfig(level);
                        if (score >= config.targetScore) {
                            handleLevelComplete();
                        } else {
                            handleGameOver();
                        }
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
    }, [isPlaying, gameState, level, score, handleGameOver, popRandomMole]);

    return (
        <div className="min-h-screen bg-sky-blue flex flex-col items-center justify-center p-4 relative overflow-hidden font-display">
            {/* Background Elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-sun-yellow rounded-full shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-bounce-slow" />
            <div className="absolute top-20 left-20 w-32 h-16 bg-white rounded-full opacity-80" />
            <div className="absolute top-32 left-32 w-20 h-10 bg-white rounded-full opacity-60" />
            <div className="absolute bottom-0 w-full h-1/3 bg-grass-green" />

            {/* Controls Container */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={onExit}
                    className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                    title="Exit to Menu"
                >
                    <LogOut className="w-6 h-6 text-red-500" />
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX className="w-6 h-6 text-gray-600" /> : <Volume2 className="w-6 h-6 text-sky-blue" />}
                </button>
            </div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-5xl font-black text-white text-outline drop-shadow-xl tracking-wider">
                        LEVEL {level}
                    </h1>
                    <div className="bg-white/30 px-4 py-2 rounded-xl text-white font-bold border-2 border-white">
                        Target: {getLevelConfig(level).targetScore}
                    </div>
                </div>

                <ScoreBoard score={score} highScore={highScore} timeLeft={timeLeft} />

                <div className="relative p-8 bg-white/40 backdrop-blur-md rounded-3xl border-4 border-white shadow-xl">
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                        {moles.map((isVisible, index) => (
                            <div key={index} className="w-24 h-24 md:w-32 md:h-32">
                                <Mole
                                    isVisible={isVisible}
                                    isHit={hitMoles[index]}
                                    onHit={() => handleWhack(index)}
                                    characterConfig={characterConfig}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {gameState === 'level-complete' && (
                    <LevelComplete
                        level={level}
                        score={score}
                        onNextLevel={nextLevel}
                    />
                )}
                {gameState === 'game-over' && (
                    <GameOver
                        score={score}
                        highScore={highScore}
                        onRestart={restartGame}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
