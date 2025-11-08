import { useEffect, useState } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.getTransactions({ limit: 3 });
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getTransactionType = (transaction) => {
    if (transaction.type === 'daily-mint') return 'claim';
    if (transaction.type === 'request') return 'sent';
    if (transaction.fromUserId?._id === user?.id || transaction.fromUserId === user?.id) return 'sent';
    return 'received';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'sent':
        return { icon: ArrowUpRight, color: '#EF4444' };
      case 'received':
        return { icon: ArrowDownLeft, color: '#10B981' };
      case 'claim':
        return { icon: Gift, color: '#F4C542' };
      default:
        return { icon: ArrowUpRight, color: '#9CA3AF' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#1A222C] rounded-2xl p-6 md:p-8 shadow-xl border border-[#2A3647]">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-[#F4C542]" strokeWidth={2} />
        <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
          Recent Transactions
        </h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-[#9CA3AF]">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-4 text-[#9CA3AF]">No recent transactions</div>
        ) : (
          transactions.map((transaction) => {
            const txType = getTransactionType(transaction);
            const { icon: Icon, color } = getIcon(txType);

            return (
              <div
                key={transaction._id || transaction.id}
                className="flex items-center justify-between p-4 bg-[#0E141B] rounded-lg border border-[#2A3647] hover:border-[#F4C542]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color }}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
                      {txType === 'received' && `From ${transaction.fromUserId?.name || transaction.fromUserId?.email || 'User'}`}
                      {txType === 'sent' && `To ${transaction.toUserId?.name || transaction.toUserId?.email || 'User'}`}
                      {txType === 'claim' && 'Daily Chips Claimed'}
                    </p>
                    <p className="text-[#9CA3AF]" style={{ fontSize: '12px', fontWeight: 400 }}>
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <p
                  className={txType === 'sent' ? 'text-[#EF4444]' : 'text-[#10B981]'}
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  {txType === 'sent' ? '-' : '+'}
                  {parseFloat(transaction.amount || '0').toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
