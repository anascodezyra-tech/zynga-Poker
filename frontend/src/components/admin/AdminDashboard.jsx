import { AdminLayout } from '../layout/AdminLayout';
import { StatsCards } from './StatsCards';
import { DailyClaimActivity } from './DailyClaimActivity';
import { UsersTable } from './UsersTable';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
            Admin Dashboard
          </h1>
          <p className="text-[#9CA3AF] mt-2" style={{ fontSize: '16px', fontWeight: 400 }}>
            Monitor chip transfers, user balances, and daily claims
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Daily Claim Activity */}
        <div className="mb-8">
          <DailyClaimActivity />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="w-full bg-[#1A222C] border border-[#2A3647] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
              style={{ fontSize: '14px', fontWeight: 400 }}
            />
          </div>
        </div>

        {/* Users Table */}
        <UsersTable searchQuery={searchQuery} />
      </motion.div>
    </AdminLayout>
  );
}

