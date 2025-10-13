import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'vip';
  favoriteItems: string[];
  averageOrderValue: number;
}

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'lastOrder' | 'totalOrders'>('name');

  useEffect(() => {
    // Load sample customer data
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '07912 345678',
        address: '123 High Street, Epping, CM16 4BA',
        totalOrders: 15,
        totalSpent: 245.50,
        lastOrder: '2024-01-15',
        joinDate: '2023-06-10',
        status: 'vip',
        favoriteItems: ['Smash Burger', 'Chicken Wings'],
        averageOrderValue: 16.37,
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '07923 456789',
        address: '45 Station Road, Epping, CM16 4BB',
        totalOrders: 8,
        totalSpent: 128.75,
        lastOrder: '2024-01-14',
        joinDate: '2023-08-22',
        status: 'active',
        favoriteItems: ['Butter Chicken', 'Garlic Naan'],
        averageOrderValue: 16.09,
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        phone: '07934 567890',
        address: '78 Church Lane, Epping, CM16 4BC',
        totalOrders: 3,
        totalSpent: 45.20,
        lastOrder: '2024-01-05',
        joinDate: '2023-12-01',
        status: 'active',
        favoriteItems: ['Crispy Fries'],
        averageOrderValue: 15.07,
      },
      {
        id: '4',
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '07945 678901',
        address: '12 Market Square, Epping, CM16 4BD',
        totalOrders: 22,
        totalSpent: 387.90,
        lastOrder: '2024-01-16',
        joinDate: '2023-03-15',
        status: 'vip',
        favoriteItems: ['Bacon Smash Burger', 'Buffalo Wings', 'Dal Tadka'],
        averageOrderValue: 17.63,
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        email: 'lisa.thompson@email.com',
        phone: '07956 789012',
        address: '56 Victoria Road, Epping, CM16 4BE',
        totalOrders: 1,
        totalSpent: 18.50,
        lastOrder: '2023-11-20',
        joinDate: '2023-11-15',
        status: 'inactive',
        favoriteItems: ['Smash Burger'],
        averageOrderValue: 18.50,
      },
    ];
    setCustomers(sampleCustomers);
  }, []);

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Customer['status']) => {
    switch (status) {
      case 'vip': return <Star className="h-4 w-4 text-purple-500" />;
      case 'active': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'inactive': return <Users className="h-4 w-4 text-gray-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'totalSpent': return b.totalSpent - a.totalSpent;
        case 'lastOrder': return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        case 'totalOrders': return b.totalOrders - a.totalOrders;
        default: return 0;
      }
    });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue: customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your customer relationships and insights</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">£{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">£{stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="totalSpent">Sort by Total Spent</option>
                <option value="lastOrder">Sort by Last Order</option>
                <option value="totalOrders">Sort by Order Count</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer since {new Date(customer.joinDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(customer.status)}
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">£{customer.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Spent</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Order:</span>
                  <span className="font-medium">{new Date(customer.lastOrder).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg Order Value:</span>
                  <span className="font-medium">£{customer.averageOrderValue.toFixed(2)}</span>
                </div>
              </div>

              {customer.favoriteItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Favorite Items:</p>
                  <div className="flex flex-wrap gap-1">
                    {customer.favoriteItems.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {customer.favoriteItems.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{customer.favoriteItems.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedCustomers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No customers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerManager;
