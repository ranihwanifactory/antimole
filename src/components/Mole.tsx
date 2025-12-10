import { motion, AnimatePresence } from 'framer-motion';
import { CharacterAvatar } from './CharacterAvatar';
import type { CharacterConfig } from './CharacterAvatar';

interface MoleProps {
    isVisible: boolean;
    isHit: boolean;
    onHit: () => void;
    characterConfig: CharacterConfig;
}

export const Mole = ({ isVisible, isHit, onHit, characterConfig }: MoleProps) => {
    return (
        <div className="relative w-full aspect-square flex items-end justify-center overflow-hidden rounded-full bg-[#5D4037] border-4 border-[#3E2723] shadow-inner">
            {/* Hole Background */}
            <div className="absolute bottom-0 w-full h-1/2 bg-black/30 rounded-b-full" />

            <AnimatePresence>
                {isVisible && !isHit && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "10%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="absolute bottom-0 w-3/4 h-3/4 cursor-pointer z-10"
                        onClick={onHit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CharacterAvatar config={characterConfig} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isHit && (
                    <motion.div
                        initial={{ scale: 1, opacity: 1, rotate: 0 }}
                        animate={{ scale: 1.2, opacity: 0, rotate: [0, -10, 10, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                        <div className="text-3xl font-display font-bold text-white text-outline drop-shadow-lg">
                            OUCH!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
