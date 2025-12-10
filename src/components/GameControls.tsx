import { Play } from 'lucide-react';

interface GameControlsProps {
    onStart: () => void;
    isPlaying: boolean;
}

export const GameControls = ({ onStart, isPlaying }: GameControlsProps) => {
    if (isPlaying) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-white/30 backdrop-blur-sm rounded-3xl">
            <button
                onClick={onStart}
                className="group relative py-4 px-10 bg-grass-green text-white font-display font-black text-3xl rounded-full shadow-[0_6px_0_#2E8B57] active:shadow-none active:translate-y-[6px] transition-all hover:bg-[#7CFC00]"
            >
                <div className="flex items-center gap-3">
                    <Play className="w-8 h-8 fill-current" />
                    <span>PLAY!</span>
                </div>
            </button>
        </div>
    );
};
