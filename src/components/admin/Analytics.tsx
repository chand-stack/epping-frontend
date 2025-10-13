import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Sample data - in a real app, this would come from an API
  const revenueData = {
    '7d': { current: 1847.50, previous: 1653.20, change: 11.7 },
    '30d': { current: 12450.75, previous: 11230.40, change: 10.9 },
    '90d': { current: 38720.25, previous: 35210.80, change: 10.0 },
    '1y': { current: 156780.50, previous: 142350.25, change: 10.2 },
  };

  const orderData = {
    '7d': { current: 89, previous: 78, change: 14.1 },
    '30d': { current: 456, previous: 412, change: 10.7 },
    '90d': { current: 1387, previous: 1256, change: 10.4 },
    '1y': { current: 5678, previous: 5123, change: 10.8 },
  };

  const topItems = [
    { name: 'Smash Burger', orders: 145, revenue: 1377.50, growth: 12.5 },
    { name: 'Chicken Wings', orders: 128, revenue: 1088.00, growth: 8.3 },
    { name: 'Butter Chicken', orders: 98, revenue: 1323.00, growth: 15.2 },
    { name: 'Crispy Fries', orders: 87, revenue: 304.50, growth: 5.1 },
    { name: 'Garlic Naan', orders: 76, revenue: 266.00, growth: 7.8 },
  ];

  const hourlyData = [
    { hour: '11:00', orders: 12, revenue: 156.50 },
    { hour: '12:00', orders: 28, revenue: 342.75 },
    { hour: '13:00', orders: 35, revenue: 428.25 },
    { hour: '14:00', orders: 18, revenue: 198.50 },
    { hour: '15:00', orders: 8, revenue: 89.25 },
    { hour: '16:00', orders: 15, revenue: 167.80 },
    { hour: '17:00', orders: 22, revenue: 278.90 },
    { hour: '18:00', orders: 45, revenue: 567.25 },
    { hour: '19:00', orders: 52, revenue: 678.50 },
    { hour: '20:00', orders: 38, revenue: 489.75 },
    { hour: '21:00', orders: 25, revenue: 312.40 },
    { hour: '22:00', orders: 12, revenue: 145.60 },
  ];

  const currentRevenue = revenueData[timeRange];
  const currentOrders = orderData[timeRange];

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">Track performance and business insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Time Range:</span>
            </div>
            <div className="flex space-x-1">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  £{currentRevenue.current.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {currentRevenue.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    currentRevenue.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentRevenue.change > 0 ? '+' : ''}{currentRevenue.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs previous</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentOrders.current.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {currentOrders.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    currentOrders.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentOrders.change > 0 ? '+' : ''}{currentOrders.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs previous</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  £{(currentRevenue.current / currentOrders.current).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">per order</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+5.2%</span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Items</h3>
              <Badge variant="outline">{getTimeRangeLabel(timeRange)}</Badge>
            </div>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">£{item.revenue.toFixed(2)}</p>
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+{item.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Peak Hours</h3>
              <Badge variant="outline">Today</Badge>
            </div>
            <div className="space-y-2">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                      {data.hour}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(data.orders / 52) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{data.orders}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">£{data.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Daily</Badge>
              <Badge variant="outline">Weekly</Badge>
              <Badge variant="outline">Monthly</Badge>
            </div>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">18.5 min</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Prep Time</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">-2.3 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Accuracy</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
