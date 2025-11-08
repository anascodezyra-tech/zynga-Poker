import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Coins, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData.role === 'admin') {
        navigate('/admin/balance');
      } else {
        navigate('/player/balance');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E141B] via-[#1A222C] to-[#0E141B] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1A222C] rounded-2xl p-6 md:p-8 shadow-2xl border border-[#2A3647]">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="bg-[#F4C542] rounded-full p-3 md:p-4 mb-3 md:mb-4">
              <Coins className="w-10 h-10 md:w-12 md:h-12 text-[#0E141B]" strokeWidth={2.5} />
            </div>
            <h1 className="text-[#F4C542] text-2xl md:text-[32px]" style={{ fontWeight: 700 }}>
              Zynga Poker
            </h1>
            <p className="text-[#9CA3AF] mt-2 text-sm md:text-base" style={{ fontWeight: 400 }}>
              Chip Management System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label htmlFor="email" className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0E141B] border border-[#2A3647] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4C542] transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-lg transition-all duration-300
                ${loading 
                  ? 'bg-[#6B7280] cursor-not-allowed' 
                  : 'bg-[#F4C542] hover:bg-[#D1A939] hover:shadow-lg'
                }
              `}
              style={{ fontSize: '16px', fontWeight: 600, color: '#0E141B' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-[#2A3647]">
            <p className="text-[#9CA3AF] mb-2 md:mb-3 text-xs md:text-xs" style={{ fontWeight: 500 }}>
              Demo Credentials:
            </p>
            <div className="space-y-1 md:space-y-2 text-[#9CA3AF] text-xs md:text-xs" style={{ fontWeight: 400 }}>
              <p className="break-words"><strong className="text-[#F4C542]">Admin:</strong> admin@example.com / Admin@123</p>
              <p className="break-words"><strong className="text-[#10B981]">Player:</strong> player1@example.com / Player@123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
