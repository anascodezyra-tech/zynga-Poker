import { useState, useEffect } from 'react';
import { PlayerLayout } from '../layout/PlayerLayout';
import { Filter, ArrowUpRight, ArrowDownLeft, Gift, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function PlayerHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, [selectedTab, dateRange]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedTab !== 'all') {
        if (selectedTab === 'sent') {
          params.type = 'request';
        } else if (selectedTab === 'received') {
          params.type = 'manual';
        } else if (selectedTab === 'pending') {
          params.status = 'pending';
        } else if (selectedTab === 'claim') {
          params.type = 'daily-mint';
        }
      }
      if (dateRange !== 'all') {
        const now = new Date();
        if (dateRange === 'today') {
          params.fromDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        } else if (dateRange === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          params.fromDate = weekAgo.toISOString();
        } else if (dateRange === 'month') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          params.fromDate = monthAgo.toISOString();
        }
      }
      const data = await api.getTransactions(params);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'sent', label: 'Sent' },
    { key: 'received', label: 'Received' },
    { key: 'pending', label: 'Pending' },
    { key: 'claim', label: 'Claims' },
  ];

  const getTransactionType = (transaction) => {
    if (transaction.type === 'daily-mint') return 'claim';
    if (transaction.type === 'request' && transaction.status === 'pending') return 'pending';
    if (transaction.type === 'request') return 'sent';
    if (transaction.fromUserId?._id === user?.id || transaction.fromUserId === user?.id) return 'sent';
    return 'received';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'sent':
      case 'pending':
        return { icon: ArrowUpRight, color: '#EF4444' };
      case 'received':
        return { icon: ArrowDownLeft, color: '#10B981' };
      case 'claim':
        return { icon: Gift, color: '#F4C542' };
      default:
        return { icon: Clock, color: '#9CA3AF' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedTab === 'all') return true;
    const txType = getTransactionType(transaction);
    return txType === selectedTab;
  });

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
            Transaction History
          </h1>
          <p className="text-[#9CA3AF] mt-2 text-sm md:text-base" style={{ fontWeight: 400 }}>
            View all your chip transactions and claims
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1A222C] rounded-2xl p-4 md:p-6 border border-[#2A3647] mb-4 md:mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 md:pb-4 mb-3 md:mb-4 border-b border-[#2A3647]">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${selectedTab === key
                    ? 'bg-[#F4C542] text-[#0E141B]'
                    : 'bg-[#2A3647] text-[#9CA3AF] hover:bg-[#3A4657]'
                  }
                `}
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[#9CA3AF]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
              style={{ fontSize: '14px', fontWeight: 400 }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-[#9CA3AF]">Loading...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-[#9CA3AF]">No transactions found</div>
          ) : (
            filteredTransactions.map((transaction) => {
              const txType = getTransactionType(transaction);
              const { icon: Icon, color } = getIcon(txType);
              
              return (
                <motion.div
                  key={transaction._id || transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1A222C] rounded-xl p-4 md:p-6 border border-[#2A3647] hover:border-[#F4C542]/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-2 md:p-3 rounded-lg"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon
                          className="w-5 h-5 md:w-6 md:h-6"
                          style={{ color }}
                          strokeWidth={2}
                        />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-white mb-1 text-sm md:text-base" style={{ fontWeight: 600 }}>
                          {txType === 'claim' && 'Daily Chips Claimed'}
                          {txType === 'sent' && `Transfer to ${transaction.toUserId?.name || transaction.toUserId?.email || 'User'}`}
                          {txType === 'received' && `Transfer from ${transaction.fromUserId?.name || transaction.fromUserId?.email || 'User'}`}
                          {txType === 'pending' && `Pending Transfer to ${transaction.toUserId?.name || transaction.toUserId?.email || 'User'}`}
                        </p>
                        <div className="flex items-center gap-2 md:gap-3 text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 400 }}>
                          <span className="whitespace-nowrap">{formatDate(transaction.createdAt)}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap">{formatTime(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p
                        className={`${txType === 'sent' || txType === 'pending' ? 'text-[#EF4444]' : 'text-[#10B981]'} text-lg md:text-[20px]`}
                        style={{ fontWeight: 700 }}
                      >
                        {txType === 'sent' || txType === 'pending' ? '-' : '+'}
                        {parseFloat(transaction.amount || '0').toLocaleString()}
                      </p>
                      {transaction.status === 'pending' && (
                        <span
                          className="px-3 py-1 bg-[#F4C542]/20 text-[#F4C542] rounded-full"
                          style={{ fontSize: '12px', fontWeight: 500 }}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </PlayerLayout>
  );
}
