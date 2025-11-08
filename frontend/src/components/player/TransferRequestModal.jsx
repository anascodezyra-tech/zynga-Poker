import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export function TransferRequestModal({ onClose }) {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Transfer request sent successfully!', {
      description: 'Your request is pending approval.',
    });

    setLoading(false);
    onClose();
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
            <h2 className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
              Request Transfer
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2A3647] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Receiver Username
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                placeholder="Enter username"
                required
              />
            </div>

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
            </div>

            <div>
              <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors resize-none"
                placeholder="Add a note..."
                rows={3}
              />
            </div>

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
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
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

