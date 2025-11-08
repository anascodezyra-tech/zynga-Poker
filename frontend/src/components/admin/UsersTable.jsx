import { useState, useEffect } from 'react';
import { ArrowUpRight, Settings } from 'lucide-react';
import { TransferModal } from './TransferModal';
import { api } from '../../services/api';

export function UsersTable({ searchQuery }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getBalance();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.name || user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-[#1A222C] rounded-2xl border border-[#2A3647] overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0E141B] border-b border-[#2A3647] sticky top-0">
              <tr>
                <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                  Username
                </th>
                <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm" style={{ fontWeight: 600 }}>
                  Balance
                </th>
                <th className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-left text-[#9CA3AF] text-xs md:text-sm hidden md:table-cell" style={{ fontWeight: 600 }}>
                  Role
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
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9CA3AF]">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9CA3AF]">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || user.id}
                    className={`
                      border-b border-[#2A3647] hover:bg-[#2A3647]/30 transition-colors
                      ${index % 2 === 0 ? 'bg-[#1A222C]' : 'bg-[#151C26]'}
                    `}
                  >
                    <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-white text-xs md:text-sm truncate max-w-[120px] md:max-w-none" style={{ fontWeight: 500 }}>
                      {user.name || user.email}
                    </td>
                    <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-[#F4C542] text-xs md:text-sm whitespace-nowrap" style={{ fontWeight: 600 }}>
                      {parseFloat(user.balance || '0').toLocaleString()}
                    </td>
                    <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-[#9CA3AF] text-xs md:text-sm hidden md:table-cell" style={{ fontWeight: 400 }}>
                      {user.role}
                    </td>
                    <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4">
                      <span className="px-2 md:px-3 py-0.5 md:py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-xs" style={{ fontWeight: 500 }}>
                        active
                      </span>
                    </td>
                    <td className="px-2 md:px-3 lg:px-6 py-3 md:py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-[#F4C542] hover:bg-[#D1A939] text-[#0E141B] rounded-lg transition-all duration-200 hover:shadow-lg text-xs md:text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Transfer</span>
                        <span className="sm:hidden">Tx</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="p-8 md:p-12 text-center">
            <p className="text-[#9CA3AF] text-sm md:text-base" style={{ fontWeight: 400 }}>
              No users found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {selectedUser && (
        <TransferModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
