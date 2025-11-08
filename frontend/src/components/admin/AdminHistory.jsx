import { AdminLayout } from '../layout/AdminLayout';
import { useState, useEffect } from 'react';
import { Filter, ArrowUpRight, RotateCcw, Gift, Search, Download, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../services/api';

export function AdminHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReversalModal, setShowReversalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reversalReason, setReversalReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [selectedType, dateRange]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'all') {
        params.type = selectedType === 'claim' ? 'daily-mint' : selectedType;
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
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleReversal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReversalModal(true);
  };

  const handleApprove = async (transaction) => {
    if (processing) return;
    setProcessing(true);
    try {
      await api.approveRequest(transaction._id || transaction.id);
      toast.success('Request approved successfully');
      fetchTransactions();
    } catch (error) {
      toast.error('Approval failed', { description: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedTransaction) return;
    
    try {
      await api.rejectRequest(
        selectedTransaction._id || selectedTransaction.id,
        rejectReason || 'No reason provided'
      );
      toast.success('Request rejected successfully');
      setShowRejectModal(false);
      setSelectedTransaction(null);
      setRejectReason('');
      fetchTransactions();
    } catch (error) {
      toast.error('Rejection failed', { description: error.message });
    }
  };

  const confirmReversal = async () => {
    if (!reversalReason.trim()) {
      toast.error('Please provide a reason for reversal');
      return;
    }

    try {
      await api.reverseTransaction(selectedTransaction._id || selectedTransaction.id, reversalReason);
      toast.success('Transaction reversed successfully');
      setShowReversalModal(false);
      setSelectedTransaction(null);
      setReversalReason('');
      fetchTransactions();
    } catch (error) {
      toast.error('Reversal failed', { description: error.message });
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (selectedType !== 'all') params.type = selectedType === 'claim' ? 'daily-mint' : selectedType;
      await api.exportTransactions(params);
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed', { description: error.message });
    }
  };

  const types = [
    { key: 'all', label: 'All' },
    { key: 'manual', label: 'Transfers' },
    { key: 'reversal', label: 'Reversals' },
    { key: 'daily-mint', label: 'Daily Mint' },
    { key: 'request', label: 'Requests' },
  ];

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = !searchQuery || 
      (tx.fromUserId?.name || tx.fromUserId?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.toUserId?.name || tx.toUserId?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'manual':
        return { icon: ArrowUpRight, color: '#3B82F6' };
      case 'reversal':
        return { icon: RotateCcw, color: '#EF4444' };
      case 'daily-mint':
        return { icon: Gift, color: '#F4C542' };
      default:
        return { icon: ArrowUpRight, color: '#9CA3AF' };
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
            Transaction History
          </h1>
          <p className="text-[#9CA3AF] mt-2 text-sm md:text-base" style={{ fontWeight: 400 }}>
            View and manage all chip transactions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1A222C] rounded-2xl p-4 md:p-6 border border-[#2A3647] mb-4 md:mb-6">
          {/* Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 md:pb-4 mb-3 md:mb-4 border-b border-[#2A3647]">
            {types.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${selectedType === key
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

          {/* Search and Date Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                style={{ fontSize: '14px', fontWeight: 400 }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-[#9CA3AF]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F4C542] hover:bg-[#D1A939] text-[#0E141B] rounded-lg transition-all"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-[#1A222C] rounded-2xl border border-[#2A3647] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0E141B] border-b border-[#2A3647]">
                <tr>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    Date & Time
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    From
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    To
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    Amount
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm hidden sm:table-cell" style={{ fontWeight: 600 }}>
                    Type
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    Status
                  </th>
                  <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-right text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => {
                    const { icon: Icon, color } = getIcon(transaction.type);
                    
                    return (
                      <tr
                        key={transaction._id || transaction.id}
                        className={`
                          border-b border-[#2A3647] hover:bg-[#2A3647]/30 transition-colors
                          ${index % 2 === 0 ? 'bg-[#1A222C]' : 'bg-[#151C26]'}
                        `}
                      >
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-white text-xs md:text-sm" style={{ fontWeight: 400 }}>
                          <div className="whitespace-nowrap">{formatDate(transaction.createdAt)}</div>
                          <div className="text-[#9CA3AF] text-xs">{formatTime(transaction.createdAt)}</div>
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-white text-xs md:text-sm truncate max-w-[100px] md:max-w-none" style={{ fontWeight: 500 }}>
                          {transaction.fromUserId?.name || transaction.fromUserId?.email || 'System'}
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-white text-xs md:text-sm truncate max-w-[100px] md:max-w-none" style={{ fontWeight: 500 }}>
                          {transaction.toUserId?.name || transaction.toUserId?.email || 'N/A'}
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-[#F4C542] text-xs md:text-sm whitespace-nowrap" style={{ fontWeight: 600 }}>
                          {parseFloat(transaction.amount || '0').toLocaleString()}
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Icon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" style={{ color }} strokeWidth={2} />
                            <span className="text-white capitalize text-xs md:text-sm" style={{ fontWeight: 400 }}>
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4">
                          <span
                            className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs ${
                              transaction.status === 'approved'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : transaction.status === 'pending'
                                ? 'bg-[#F4C542]/20 text-[#F4C542]'
                                : 'bg-[#EF4444]/20 text-[#EF4444]'
                            }`}
                            style={{ fontWeight: 500 }}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {transaction.type === 'request' && transaction.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(transaction)}
                                  disabled={processing}
                                  className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] rounded-lg transition-all duration-200 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ fontWeight: 600 }}
                                >
                                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden sm:inline">Accept</span>
                                </button>
                                <button
                                  onClick={() => handleReject(transaction)}
                                  disabled={processing}
                                  className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] rounded-lg transition-all duration-200 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ fontWeight: 600 }}
                                >
                                  <X className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden sm:inline">Reject</span>
                                </button>
                              </>
                            )}
                            {transaction.type === 'manual' && transaction.status === 'approved' && (
                              <button
                                onClick={() => handleReversal(transaction)}
                                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] rounded-lg transition-all duration-200 text-xs md:text-xs"
                                style={{ fontWeight: 600 }}
                              >
                                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Reverse</span>
                                <span className="sm:hidden">Rev</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedTransaction && (
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A222C] rounded-2xl p-6 md:p-8 w-full max-w-md border border-[#2A3647]"
            >
              <h2 className="text-white mb-4 text-xl md:text-[24px]" style={{ fontWeight: 700 }}>
                Reject Request
              </h2>
              <p className="text-[#9CA3AF] mb-6 text-sm md:text-base" style={{ fontWeight: 400 }}>
                Are you sure you want to reject this transfer request?
              </p>
              <div className="bg-[#0E141B] rounded-lg p-4 mb-6">
                <div className="space-y-2 text-white" style={{ fontSize: '14px', fontWeight: 400 }}>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">From:</span>
                    <span>{selectedTransaction.fromUserId?.name || selectedTransaction.fromUserId?.email || 'System'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">To:</span>
                    <span>{selectedTransaction.toUserId?.name || selectedTransaction.toUserId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Amount:</span>
                    <span className="text-[#F4C542]">{parseFloat(selectedTransaction.amount || '0').toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors resize-none"
                  placeholder="Enter reason for rejection..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-[#2A3647] hover:bg-[#3A4657] text-white rounded-lg transition-colors"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Reject Request
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Reversal Confirmation Modal */}
      {showReversalModal && selectedTransaction && (
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A222C] rounded-2xl p-6 md:p-8 w-full max-w-md border border-[#2A3647]"
            >
              <h2 className="text-white mb-4 text-xl md:text-[24px]" style={{ fontWeight: 700 }}>
                Confirm Reversal
              </h2>
              <p className="text-[#9CA3AF] mb-6 text-sm md:text-base" style={{ fontWeight: 400 }}>
                Are you sure you want to reverse this transaction?
              </p>
              <div className="bg-[#0E141B] rounded-lg p-4 mb-6">
                <div className="space-y-2 text-white" style={{ fontSize: '14px', fontWeight: 400 }}>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">From:</span>
                    <span>{selectedTransaction.fromUserId?.name || selectedTransaction.fromUserId?.email || 'System'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">To:</span>
                    <span>{selectedTransaction.toUserId?.name || selectedTransaction.toUserId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Amount:</span>
                    <span className="text-[#F4C542]">{parseFloat(selectedTransaction.amount || '0').toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Reason for Reversal *
                </label>
                <textarea
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors resize-none"
                  placeholder="Enter reason for reversal..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReversalModal(false);
                    setReversalReason('');
                  }}
                  className="flex-1 px-6 py-3 bg-[#2A3647] hover:bg-[#3A4657] text-white rounded-lg transition-colors"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReversal}
                  className="flex-1 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Reverse Transaction
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </AdminLayout>
  );
}
