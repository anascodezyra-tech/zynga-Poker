import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, History, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MobileNav({ role }) {
  const { logout } = useAuth();
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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A222C] border-t border-[#2A3647] px-2 py-2 z-50">
      <div className="flex items-center justify-around">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-[#F4C542]'
                  : 'text-[#9CA3AF]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-[#9CA3AF] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          <span style={{ fontSize: '10px', fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </nav>
  );
}

