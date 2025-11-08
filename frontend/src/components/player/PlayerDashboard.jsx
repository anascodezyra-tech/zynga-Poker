import { PlayerLayout } from '../layout/PlayerLayout';
import { DailyChipsClaim } from './DailyChipsClaim';
import { BalanceCard } from './BalanceCard';
import { RecentTransactions } from './RecentTransactions';
import { TransferRequestModal } from './TransferRequestModal';
import { useState } from 'react';
import { motion } from 'motion/react';

export function PlayerDashboard() {
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <PlayerLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
            Dashboard
          </h1>
          <p className="text-[#9CA3AF] mt-2" style={{ fontSize: '16px', fontWeight: 400 }}>
            Welcome back! Claim your daily chips and manage your balance.
          </p>
        </div>

        {/* Daily Chips Claim */}
        <div className="mb-8">
          <DailyChipsClaim />
        </div>

        {/* Balance and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceCard onTransferClick={() => setShowTransferModal(true)} />
          <RecentTransactions />
        </div>
      </motion.div>

      {/* Transfer Request Modal */}
      {showTransferModal && (
        <TransferRequestModal onClose={() => setShowTransferModal(false)} />
      )}
    </PlayerLayout>
  );
}

