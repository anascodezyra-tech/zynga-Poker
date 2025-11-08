import { Gift, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { hour: '00:00', claims: 12 },
  { hour: '04:00', claims: 8 },
  { hour: '08:00', claims: 45 },
  { hour: '12:00', claims: 67 },
  { hour: '16:00', claims: 38 },
  { hour: '20:00', claims: 52 },
];

export function DailyClaimActivity() {
  return (
    <div className="bg-[#1A222C] rounded-2xl p-6 md:p-8 border border-[#2A3647]">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-6 h-6 text-[#F4C542]" strokeWidth={2} />
        <h2 className="text-white" style={{ fontSize: '24px', fontWeight: 700 }}>
          Daily Claim Activity
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0E141B] rounded-xl p-4 border border-[#2A3647]">
          <p className="text-[#9CA3AF] mb-2" style={{ fontSize: '14px', fontWeight: 400 }}>
            Total Claims Today
          </p>
          <p className="text-[#F4C542]" style={{ fontSize: '28px', fontWeight: 700 }}>
            222
          </p>
        </div>

        <div className="bg-[#0E141B] rounded-xl p-4 border border-[#2A3647]">
          <p className="text-[#9CA3AF] mb-2" style={{ fontSize: '14px', fontWeight: 400 }}>
            Chips Distributed
          </p>
          <p className="text-[#10B981]" style={{ fontSize: '28px', fontWeight: 700 }}>
            2,220,000
          </p>
        </div>

        <div className="bg-[#0E141B] rounded-xl p-4 border border-[#2A3647]">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[#9CA3AF]" style={{ fontSize: '14px', fontWeight: 400 }}>
              Trend
            </p>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-white" style={{ fontSize: '28px', fontWeight: 700 }}>
            +12%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3647" />
            <XAxis
              dataKey="hour"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A222C',
                border: '1px solid #2A3647',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Bar dataKey="claims" fill="#F4C542" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

