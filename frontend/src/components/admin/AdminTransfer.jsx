import { AdminLayout } from '../layout/AdminLayout';
import { useState, useEffect } from 'react';
import { ArrowLeftRight, Send, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../services/api';

export function AdminTransfer() {
  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getBalance();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (fromUserId && fromUserId === toUserId) {
      setError('Cannot transfer to the same user');
      return;
    }

    if (!toUserId || !amount || parseFloat(amount) <= 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    setLoading(true);

    try {
      await api.transfer({
        toUserId,
        fromUserId: fromUserId || undefined,
        amount: parseFloat(amount),
        type: 'manual',
        reason: reason || undefined,
      });

      toast.success('Transfer completed successfully!', {
        description: `${parseInt(amount).toLocaleString()} chips transferred`,
      });

      setFromUserId('');
      setToUserId('');
      setAmount('');
      setReason('');
    } catch (err) {
      setError(err.message || 'Transfer failed');
      toast.error('Transfer failed', {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-white text-2xl md:text-[32px]" style={{ fontWeight: 700 }}>
            Transfer Chips
          </h1>
          <p className="text-[#9CA3AF] mt-2 text-sm md:text-base" style={{ fontWeight: 400 }}>
            Transfer chips between users or adjust balances
          </p>
        </div>

        {/* Transfer Form */}
        <div className="max-w-4xl">
          <div className="bg-[#1A222C] rounded-2xl p-6 md:p-8 border border-[#2A3647]">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="p-2 md:p-3 bg-[#F4C542]/20 rounded-lg">
                <ArrowLeftRight className="w-5 h-5 md:w-6 md:h-6 text-[#F4C542]" strokeWidth={2} />
              </div>
              <h2 className="text-white text-xl md:text-[24px]" style={{ fontWeight: 700 }}>
                New Transfer
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From User (Optional) */}
              <div>
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  From User (Optional - leave empty for credit)
                </label>
                <select
                  value={fromUserId}
                  onChange={(e) => setFromUserId(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                >
                  <option value="">System Credit</option>
                  {users.map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* To User */}
              <div>
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  To User *
                </label>
                <select
                  value={toUserId}
                  onChange={(e) => setToUserId(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                  required
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Amount *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                  placeholder="Enter amount"
                  required
                  min="1"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors resize-none"
                  placeholder="Add a reason for this transfer..."
                  rows={4}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3"
                >
                  <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                  <span className="text-[#EF4444]" style={{ fontSize: '14px', fontWeight: 400 }}>
                    {error}
                  </span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full md:w-auto px-8 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${loading
                    ? 'bg-[#6B7280] cursor-not-allowed'
                    : 'bg-[#F4C542] hover:bg-[#D1A939] hover:shadow-lg'
                  }
                `}
                style={{ fontSize: '16px', fontWeight: 600, color: '#0E141B' }}
              >
                {loading ? (
                  'Processing Transfer...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Complete Transfer
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
