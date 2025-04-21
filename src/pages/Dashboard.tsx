import React from 'react';
import { Button } from '../components/ui/Button.js';
import { LucideBarChart, LucideUsers, LucideActivity, LucideShoppingCart } from 'lucide-react';

/**
 * Dashboard page component with sample statistics and charts
 */
export const Dashboard: React.FC = () => {
  // Sample data for the dashboard
  const stats = [
    {
      name: 'Total Users',
      value: '12,345',
      icon: LucideUsers,
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Revenue',
      value: '$54,321',
      icon: LucideShoppingCart,
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Active Sessions',
      value: '2,543',
      icon: LucideActivity,
      change: '-3%',
      changeType: 'decrease',
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      icon: LucideBarChart,
      change: '+2%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of key metrics and performance indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 transition-colors duration-200">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500 dark:text-gray-400">from previous period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    User #{Math.floor(Math.random() * 1000)} performed action #
                    {Math.floor(Math.random() * 100)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(Date.now() - Math.random() * 86400000 * 5).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
