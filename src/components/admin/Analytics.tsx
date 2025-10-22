import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/config/api';
import { StatsCardSkeleton, AnalyticsChartSkeleton } from '@/components/ui/skeletons';
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

interface AnalyticsData {
  timeRange: string;
  metrics: {
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    avgOrderValue: number;
    customers: { total: number; change: number };
  };
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  hourlyData: Array<{
    hour: string;
    orders: number;
    revenue: number;
  }>;
  dailyTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/analytics?timeRange=${timeRange}`);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
            <p className="text-gray-600 dark:text-gray-400">Track performance and business insights</p>
          </div>
        </div>

        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <AnalyticsChartSkeleton key={i} />
          ))}
        </div>

        {/* Top Items Skeleton */}
        <AnalyticsChartSkeleton />
      </div>
    );
  }

  const { metrics, topItems, hourlyData } = analyticsData;
  const currentRevenue = metrics.revenue;
  const currentOrders = metrics.orders;

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
                  £{metrics.avgOrderValue.toFixed(2)}
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.customers.total}
                </p>
                <div className="flex items-center mt-1">
                  {metrics.customers.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metrics.customers.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.customers.change > 0 ? '+' : ''}{metrics.customers.change}%
                  </span>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentOrders.current}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders ({timeRange.toUpperCase()})</p>
              <div className="flex items-center justify-center mt-1">
                {currentOrders.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${currentOrders.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentOrders.change > 0 ? '+' : ''}{currentOrders.change}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                £{currentRevenue.current.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue ({timeRange.toUpperCase()})</p>
              <div className="flex items-center justify-center mt-1">
                {currentRevenue.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${currentRevenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentRevenue.change > 0 ? '+' : ''}{currentRevenue.change}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {topItems.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Menu Items</p>
              <div className="flex items-center justify-center mt-1">
                <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
