import { motion } from 'framer-motion';
import { RefreshCw, Star } from 'lucide-react';

interface GameOverProps {
    score: number;
    highScore: number;
    onRestart: () => void;
}

export const GameOver = ({ score, highScore, onRestart }: GameOverProps) => {
    const isNewHighScore = score > highScore;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-white border-4 border-sky-blue p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
            >
                {/* Decorative Circles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-sun-yellow/20 rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cute-pink/20 rounded-full" />

                <h2 className="text-4xl font-display font-black text-sky-blue mb-2 drop-shadow-sm">
                    GOOD JOB!
                </h2>

                <div className="my-8 space-y-4 relative z-10">
                    <div className="flex flex-col items-center bg-soft-white p-4 rounded-2xl border-2 border-gray-100">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Final Score</span>
                        <span className="text-6xl font-display font-black text-chocolate">{score}</span>
                    </div>

                    {isNewHighScore && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1 bg-sun-yellow text-white rounded-full shadow-md transform -rotate-2"
                        >
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-sm">New Best Score!</span>
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={onRestart}
                    className="w-full py-4 px-6 bg-cute-pink text-white font-black font-display text-xl rounded-xl shadow-[0_4px_0_#DB7093] active:shadow-none active:translate-y-[4px] transition-all hover:brightness-110"
                >
                    <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6" />
                        <span>PLAY AGAIN</span>
                    </div>
                </button>
            </motion.div>
        </motion.div>
    );
};
