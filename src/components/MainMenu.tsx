import { useState, useRef } from 'react';
import { Play, Upload } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import type { CharacterConfig, CharacterType } from './CharacterAvatar';

interface MainMenuProps {
    onStart: (config: CharacterConfig) => void;
}

export const MainMenu = ({ onStart }: MainMenuProps) => {
    const [selectedType, setSelectedType] = useState<CharacterType>('mole');
    const [customImage, setCustomImage] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result as string);
                setSelectedType('custom');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStart = () => {
        onStart({
            type: selectedType,
            customImage: selectedType === 'custom' ? customImage : undefined,
        });
    };

    const characters: { type: CharacterType; label: string }[] = [
        { type: 'mole', label: 'Mole' },
        { type: 'rabbit', label: 'Rabbit' },
        { type: 'bear', label: 'Bear' },
    ];

    return (
        <div className="min-h-screen bg-sky-blue flex flex-col items-center justify-center p-4 relative overflow-hidden font-display">
            {/* Background Elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-sun-yellow rounded-full shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-bounce-slow" />
            <div className="absolute bottom-0 w-full h-1/3 bg-grass-green" />

            <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-md rounded-[2rem] border-4 border-white shadow-xl p-8 text-center">
                <h1 className="text-5xl font-black text-white mb-8 text-outline drop-shadow-xl tracking-wider">
                    두더지잡기
                </h1>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white text-outline mb-4">Choose Your Character</h2>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {characters.map((char) => (
                            <button
                                key={char.type}
                                onClick={() => setSelectedType(char.type)}
                                className={`relative aspect-square rounded-2xl p-2 transition-all ${selectedType === char.type
                                    ? 'bg-white scale-110 shadow-lg ring-4 ring-sun-yellow'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            >
                                <CharacterAvatar config={{ type: char.type }} />
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${selectedType === 'custom'
                                ? 'bg-white text-sky-blue ring-4 ring-sun-yellow shadow-lg'
                                : 'bg-white/50 text-white hover:bg-white/80'
                                }`}
                        >
                            {customImage ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img src={customImage} alt="Custom" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            <span className="font-bold">Upload Custom Photo</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-4 bg-grass-green text-white font-black text-3xl rounded-2xl shadow-[0_6px_0_#2E8B57] active:shadow-none active:translate-y-[6px] transition-all hover:bg-[#7CFC00] flex items-center justify-center gap-3"
                >
                    <Play className="w-8 h-8 fill-current" />
                    <span>START GAME</span>
                </button>
            </div>
        </div>
    );
};
