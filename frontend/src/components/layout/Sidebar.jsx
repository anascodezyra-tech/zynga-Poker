import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ArrowLeftRight, History, LogOut, Coins, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/balance', icon: LayoutDashboard, label: 'Balance' },
    { to: '/admin/transfer', icon: ArrowLeftRight, label: 'Transfer' },
    { to: '/admin/history', icon: History, label: 'History' },
  ];

  const playerLinks = [
    { to: '/player/balance', icon: LayoutDashboard, label: 'Balance' },
    { to: '/player/transfer', icon: ArrowLeftRight, label: 'Transfer' },
    { to: '/player/history', icon: History, label: 'History' },
  ];

  const links = role === 'admin' ? adminLinks : playerLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1A222C] border-r border-[#2A3647] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A3647]">
        <div className="flex items-center gap-3">
          <div className="bg-[#F4C542] rounded-full p-2">
            <Coins className="w-6 h-6 text-[#0E141B]" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
              Zynga Poker
            </h2>
            <p className="text-[#9CA3AF]" style={{ fontSize: '12px', fontWeight: 400 }}>
              {role === 'admin' ? 'Admin Panel' : 'Player Panel'}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-[#2A3647]">
        <p className="text-[#9CA3AF] mb-1" style={{ fontSize: '12px', fontWeight: 400 }}>
          Logged in as
        </p>
        <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
          {user?.username}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#F4C542] text-[#0E141B]'
                  : 'text-[#9CA3AF] hover:bg-[#2A3647] hover:text-white'
              }`
            }
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2A3647]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:bg-[#2A3647] hover:text-white transition-all duration-200 w-full"
          style={{ fontSize: '14px', fontWeight: 500 }}
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}

