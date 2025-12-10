import { motion, AnimatePresence } from 'framer-motion';

interface MoleProps {
    isVisible: boolean;
    isHit: boolean;
    onHit: () => void;
}

export const Mole = ({ isVisible, isHit, onHit }: MoleProps) => {
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
                        {/* Cute Mole Body */}
                        <div className="w-full h-full bg-chocolate rounded-t-[40%] relative shadow-lg">
                            {/* Eyes */}
                            <div className="absolute top-1/3 left-1/4 w-3 h-4 bg-black rounded-full">
                                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                            </div>
                            <div className="absolute top-1/3 right-1/4 w-3 h-4 bg-black rounded-full">
                                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                            </div>

                            {/* Pink Nose */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-6 h-4 bg-cute-pink rounded-full shadow-sm" />

                            {/* Whiskers */}
                            <div className="absolute top-1/2 left-2 w-4 h-0.5 bg-black/20 rotate-12" />
                            <div className="absolute top-[55%] left-2 w-4 h-0.5 bg-black/20 -rotate-12" />
                            <div className="absolute top-1/2 right-2 w-4 h-0.5 bg-black/20 -rotate-12" />
                            <div className="absolute top-[55%] right-2 w-4 h-0.5 bg-black/20 rotate-12" />

                            {/* Tummy */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-[#DEB887] rounded-t-full opacity-80" />
                        </div>
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
