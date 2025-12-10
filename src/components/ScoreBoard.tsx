import { Trophy, Timer, Star } from 'lucide-react';

interface ScoreBoardProps {
    score: number;
    highScore: number;
    timeLeft: number;
}

export const ScoreBoard = ({ score, highScore, timeLeft }: ScoreBoardProps) => {
    return (
        <div className="flex justify-between items-center w-full max-w-2xl mx-auto mb-8 gap-4">
            {/* High Score Cloud */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-sky-blue transform -rotate-2">
                <div className="p-1.5 bg-sun-yellow rounded-full">
                    <Trophy className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Best</span>
                    <span className="text-xl font-display font-bold text-sky-blue">{highScore}</span>
                </div>
            </div>

            {/* Timer Sun */}
            <div className="flex flex-col items-center bg-sun-yellow p-4 rounded-full border-4 border-white shadow-xl relative z-20">
                <Timer className="w-6 h-6 text-white mb-1" />
                <span className={`text-2xl font-display font-black text-white ${timeLeft <= 10 ? 'animate-pulse text-red-500' : ''}`}>
                    {timeLeft}
                </span>
            </div>

            {/* Score Cloud */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-cute-pink transform rotate-2">
                <div className="p-1.5 bg-cute-pink rounded-full">
                    <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                    <span className="text-xl font-display font-bold text-cute-pink">{score}</span>
                </div>
            </div>
        </div>
    );
};
