import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DailyChipsClaim() {
  const [isClaimed, setIsClaimed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds

  // Countdown timer
  useEffect(() => {
    if (!isClaimed) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          setIsClaimed(false);
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isClaimed]);

  const handleClaim = () => {
    setIsClaimed(true);
    setShowSuccess(true);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const progressPercentage = ((24 * 60 * 60 - timeRemaining) / (24 * 60 * 60)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#1A2332] rounded-2xl p-8 md:p-12 shadow-2xl border border-[#2A3647]">
        {/* Header */}
        <div className="flex items-center justify-center md:justify-start gap-3 mb-12">
          <Coins className="w-8 h-8 text-[#F4C542]" strokeWidth={2.5} />
          <h1 className="text-[#F4C542]" style={{ fontSize: '24px', fontWeight: 600 }}>
            Daily Chips: 10,000
          </h1>
        </div>

        {/* Claim Button */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.button
            onClick={handleClaim}
            disabled={isClaimed}
            whileHover={!isClaimed ? { scale: 1.02 } : {}}
            whileTap={!isClaimed ? { scale: 0.98 } : {}}
            className={`
              w-full max-w-md px-8 py-4 rounded-xl transition-all duration-300 
              ${
                isClaimed
                  ? 'bg-[#6B7280] text-white cursor-not-allowed'
                  : 'bg-[#F4C542] text-[#0E141B] hover:bg-[#D1A939] cursor-pointer'
              }
            `}
            style={{ fontSize: '16px', fontWeight: 600 }}
          >
            {isClaimed ? 'Claimed Today' : 'Claim Today\'s Chips'}
          </motion.button>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-[#10B981]"
                style={{ fontSize: '16px', fontWeight: 400 }}
              >
                <span>✅</span>
                <span>Chips Added Successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Section */}
        {isClaimed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Countdown Label */}
            <p className="text-center text-[#9CA3AF]" style={{ fontSize: '14px', fontWeight: 500 }}>
              Next chips available in: {formatTime(timeRemaining)}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#1F2937] rounded-xl h-3 overflow-hidden">
              <motion.div
                className="h-full bg-[#F4C542] rounded-xl"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

