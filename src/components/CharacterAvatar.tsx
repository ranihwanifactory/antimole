

export type CharacterType = 'mole' | 'rabbit' | 'bear' | 'custom';

export interface CharacterConfig {
    type: CharacterType;
    customImage?: string; // Data URL for custom image
}

interface CharacterAvatarProps {
    config: CharacterConfig;
    className?: string;
}

export const CharacterAvatar = ({ config, className = "" }: CharacterAvatarProps) => {
    if (config.type === 'custom' && config.customImage) {
        return (
            <div className={`relative w-full h-full overflow-hidden rounded-t-[40%] ${className}`}>
                <img
                    src={config.customImage}
                    alt="Custom Character"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // Preset Characters (CSS Art)
    switch (config.type) {
        case 'rabbit':
            return (
                <div className={`w-full h-full bg-white rounded-t-[40%] relative shadow-lg ${className}`}>
                    {/* Ears */}
                    <div className="absolute -top-4 left-2 w-4 h-10 bg-white rounded-full border-2 border-gray-100" />
                    <div className="absolute -top-4 right-2 w-4 h-10 bg-white rounded-full border-2 border-gray-100" />
                    {/* Eyes */}
                    <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-black rounded-full" />
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-black rounded-full" />
                    {/* Nose */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-3 bg-pink-300 rounded-full" />
                    {/* Whiskers */}
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-black/10 rotate-12" />
                    <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-black/10 -rotate-12" />
                </div>
            );
        case 'bear':
            return (
                <div className={`w-full h-full bg-[#8D6E63] rounded-t-[40%] relative shadow-lg ${className}`}>
                    {/* Ears */}
                    <div className="absolute -top-2 left-0 w-6 h-6 bg-[#8D6E63] rounded-full" />
                    <div className="absolute -top-2 right-0 w-6 h-6 bg-[#8D6E63] rounded-full" />
                    {/* Eyes */}
                    <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-black rounded-full" />
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-black rounded-full" />
                    {/* Snout */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-10 h-8 bg-[#D7CCC8] rounded-full" />
                    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-4 h-3 bg-[#3E2723] rounded-full" />
                </div>
            );
        case 'mole':
        default:
            return (
                <div className={`w-full h-full bg-[#D2691E] rounded-t-[40%] relative shadow-lg ${className}`}>
                    {/* Eyes */}
                    <div className="absolute top-1/3 left-1/4 w-3 h-4 bg-black rounded-full">
                        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-4 bg-black rounded-full">
                        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                    </div>
                    {/* Nose */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-6 h-4 bg-[#FFB6C1] rounded-full shadow-sm" />
                    {/* Whiskers */}
                    <div className="absolute top-1/2 left-2 w-4 h-0.5 bg-black/20 rotate-12" />
                    <div className="absolute top-[55%] left-2 w-4 h-0.5 bg-black/20 -rotate-12" />
                    <div className="absolute top-1/2 right-2 w-4 h-0.5 bg-black/20 -rotate-12" />
                    <div className="absolute top-[55%] right-2 w-4 h-0.5 bg-black/20 rotate-12" />
                    {/* Tummy */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-[#DEB887] rounded-t-full opacity-80" />
                </div>
            );
    }
};
