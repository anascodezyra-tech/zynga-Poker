import { Wallet, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function BalanceCard({ onTransferClick }) {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await api.getBalance();
        setBalance(data.balance || '0');
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-[#1A222C] rounded-2xl p-6 md:p-8 shadow-xl border border-[#2A3647]">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-6 h-6 text-[#F4C542]" strokeWidth={2} />
        <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
          Current Balance
        </h3>
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="h-12 bg-[#2A3647] rounded animate-pulse" />
        ) : (
          <>
            <p className="text-[#F4C542] mb-1 text-3xl md:text-[48px]" style={{ fontWeight: 700 }}>
              {parseFloat(balance).toLocaleString()}
            </p>
            <p className="text-[#9CA3AF] text-sm md:text-sm" style={{ fontWeight: 400 }}>
              Total Chips Available
            </p>
          </>
        )}
      </div>

      <motion.button
        onClick={onTransferClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 w-full bg-[#2A3647] hover:bg-[#3A4657] text-white px-6 py-3 rounded-lg transition-all duration-200"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        <ArrowUpRight className="w-5 h-5" />
        Request Transfer
      </motion.button>
    </div>
  );
}
