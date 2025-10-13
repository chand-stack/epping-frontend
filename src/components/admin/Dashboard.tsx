import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Utensils,
  BarChart3
} from 'lucide-react';
import { AdminStats } from '@/services/adminService';

interface DashboardProps {
  adminStats: AdminStats | null;
}

const Dashboard: React.FC<DashboardProps> = ({ adminStats }) => {
  const stats = [
    {
      title: 'Orders Today',
      value: adminStats ? adminStats.ordersToday.toString() : '0',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Active Customers',
      value: adminStats ? adminStats.activeCustomers.toString() : '0',
      change: '+5.1%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Menu Items',
      value: '150+',
      change: '+2.1%',
      changeType: 'positive',
      icon: Utensils,
      color: 'text-green-600'
    },
    {
      title: 'Low Stock Items',
      value: adminStats ? adminStats.lowStockItems.toString() : '0',
      change: '-15.3%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const recentOrders = adminStats?.recentOrders.map(order => ({
    id: `#${order.id}`,
    customer: order.customerInfo.name,
    items: order.items.length,
    status: order.status,
    time: new Date(order.createdAt).toLocaleTimeString()
  })) || [];

  const topItems = adminStats?.topItems.map(item => ({
    name: item.name,
    orders: item.orders
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="opacity-90 text-sm sm:text-base">Here's what's happening at Epping Food Court today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <div className="flex items-center mt-1 sm:mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 flex-shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color} flex-shrink-0`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.time}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Items</h3>
              <Button variant="outline" size="sm">View Menu</Button>
            </div>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
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
                    <span className="text-sm text-gray-500">Popular</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>New Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Utensils className="h-6 w-6" />
              <span>Add Menu Item</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>View Customers</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
