import { PlayerLayout } from '../layout/PlayerLayout';
import { BalanceCard } from './BalanceCard';
import { RecentTransactions } from './RecentTransactions';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function PlayerBalance() {
  const navigate = useNavigate();

  return (
    <PlayerLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-white text-2xl md:text-[32px]" style={{ fontWeight: 700 }}>
            Balance
          </h1>
          <p className="text-[#9CA3AF] mt-2 text-sm md:text-base" style={{ fontWeight: 400 }}>
            View your current chip balance
          </p>
        </div>

        {/* Balance and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceCard onTransferClick={() => navigate('/player/transfer')} />
          <RecentTransactions />
        </div>
      </motion.div>
    </PlayerLayout>
  );
}

