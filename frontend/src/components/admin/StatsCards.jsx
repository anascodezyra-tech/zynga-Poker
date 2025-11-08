import { Coins, ArrowLeftRight, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Chips',
    value: '12,450,000',
    icon: Coins,
    color: '#F4C542',
    bgColor: '#F4C54220',
  },
  {
    title: 'Transfers Today',
    value: '47',
    icon: ArrowLeftRight,
    color: '#10B981',
    bgColor: '#10B98120',
  },
  {
    title: 'Active Players',
    value: '1,234',
    icon: Users,
    color: '#3B82F6',
    bgColor: '#3B82F620',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#1A222C] rounded-2xl p-6 border border-[#2A3647] hover:border-[#F4C542]/30 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon
                className="w-6 h-6"
                style={{ color: stat.color }}
                strokeWidth={2}
              />
            </div>
          </div>
          
          <p className="text-[#9CA3AF] mb-1" style={{ fontSize: '14px', fontWeight: 400 }}>
            {stat.title}
          </p>
          <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

