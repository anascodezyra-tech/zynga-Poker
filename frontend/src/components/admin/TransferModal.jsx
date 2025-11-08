import { useState, useEffect } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../services/api';

export function TransferModal({ user, onClose }) {
  const [transferType, setTransferType] = useState('to');
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

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transferType === 'from' && amountNum > parseFloat(user.balance || '0')) {
      setError('Insufficient chips in user balance');
      return;
    }

    setLoading(true);

    try {
      if (transferType === 'to') {
        await api.transfer({
          toUserId: user._id || user.id,
          amount: amountNum,
          type: 'manual',
          reason: reason || undefined,
        });
      } else {
        await api.transfer({
          fromUserId: user._id || user.id,
          toUserId: users.find(u => u._id !== user._id)?._id || users[0]?._id,
          amount: amountNum,
          type: 'manual',
          reason: reason || undefined,
        });
      }

      toast.success('Transfer completed successfully!', {
        description: `${amountNum.toLocaleString()} chips transferred ${transferType} ${user.name || user.email}`,
      });

      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Transfer failed');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1A222C] rounded-2xl p-6 md:p-8 w-full max-w-md border border-[#2A3647] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
                Transfer Chips
              </h2>
              <p className="text-[#9CA3AF] mt-1" style={{ fontSize: '14px', fontWeight: 400 }}>
                User: {user.name || user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2A3647] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transfer Type */}
            <div>
              <label className="block text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
                Transfer Direction
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransferType('to')}
                  className={`
                    px-4 py-3 rounded-lg transition-all duration-200
                    ${transferType === 'to'
                      ? 'bg-[#F4C542] text-[#0E141B]'
                      : 'bg-[#2A3647] text-[#9CA3AF] hover:bg-[#3A4657]'
                    }
                  `}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  To User
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('from')}
                  className={`
                    px-4 py-3 rounded-lg transition-all duration-200
                    ${transferType === 'from'
                      ? 'bg-[#F4C542] text-[#0E141B]'
                      : 'bg-[#2A3647] text-[#9CA3AF] hover:bg-[#3A4657]'
                    }
                  `}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  From User
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Amount
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
              {transferType === 'from' && (
                <p className="text-[#9CA3AF] mt-2" style={{ fontSize: '12px', fontWeight: 400 }}>
                  User Balance: {parseFloat(user.balance || '0').toLocaleString()}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Note (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors resize-none"
                placeholder="Add a note..."
                rows={3}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                <span className="text-[#EF4444]" style={{ fontSize: '14px', fontWeight: 400 }}>
                  {error}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-[#2A3647] hover:bg-[#3A4657] text-white rounded-lg transition-colors"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${loading
                    ? 'bg-[#6B7280] cursor-not-allowed'
                    : 'bg-[#F4C542] hover:bg-[#D1A939] hover:shadow-lg'
                  }
                `}
                style={{ fontSize: '14px', fontWeight: 600, color: '#0E141B' }}
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Transfer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
