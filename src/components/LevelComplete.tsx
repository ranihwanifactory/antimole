import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface LevelCompleteProps {
    level: number;
    score: number;
    onNextLevel: () => void;
}

export const LevelComplete = ({ level, score, onNextLevel }: LevelCompleteProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-display"
        >
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white border-4 border-sun-yellow p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-sun-yellow" />

                <h2 className="text-4xl font-black text-sun-yellow mb-2 drop-shadow-sm text-outline">
                    LEVEL COMPLETE!
                </h2>

                <div className="my-8 space-y-4">
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Star className="w-12 h-12 text-sun-yellow fill-sun-yellow drop-shadow-md" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-soft-white p-4 rounded-2xl border-2 border-gray-100">
                        <p className="text-gray-400 font-bold uppercase text-xs mb-1">Total Score</p>
                        <p className="text-5xl font-black text-chocolate">{score}</p>
                    </div>

                    <p className="text-sky-blue font-bold">
                        Get ready for Level {level + 1}!
                        <br />
                        <span className="text-sm opacity-75">Faster moles & higher targets!</span>
                    </p>
                </div>

                <button
                    onClick={onNextLevel}
                    className="w-full py-4 px-6 bg-sky-blue text-white font-black text-xl rounded-xl shadow-[0_4px_0_#4682B4] active:shadow-none active:translate-y-[4px] transition-all hover:brightness-110 flex items-center justify-center gap-2"
                >
                    <span>NEXT LEVEL</span>
                    <ArrowRight className="w-6 h-6" />
                </button>
            </motion.div>
        </motion.div>
    );
};
