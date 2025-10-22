import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/config/api';
import { toast } from 'sonner';
import { 
  Store, 
  Clock, 
  DollarSign, 
  Bell, 
  Zap, 
  Share2,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface Settings {
  // Business Information
  businessName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  
  // Business Hours
  businessHours: BusinessHours[];
  
  // Tax & Payment
  taxRate: number;
  currency: string;
  acceptCash: boolean;
  acceptCard: boolean;
  acceptOnlinePayment: boolean;
  
  // Notifications
  emailNotifications: boolean;
  orderNotificationEmail: string;
  lowStockNotifications: boolean;
  lowStockThreshold: number;
  
  // Order Management
  enableOnlineOrdering: boolean;
  minimumOrderAmount: number;
  estimatedPrepTime: number;
  
  // Feature Toggles
  enableLoyaltyProgram: boolean;
  enableInventoryTracking: boolean;
  enableCustomerReviews: boolean;
  
  // Display Settings
  itemsPerPage: number;
  defaultOrderStatus: string;
  
  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
}

const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'hours' | 'payment' | 'notifications' | 'features' | 'social'>('business');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/settings');
      setSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await apiClient.put('/settings', settings);
      setSettings(response.data.data);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    try {
      const response = await apiClient.post('/settings/reset');
      setSettings(response.data.data);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Settings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: any) => {
    if (!settings) return;
    const newHours = [...settings.businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setSettings({ ...settings, businessHours: newHours });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Store },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'payment', label: 'Tax & Payment', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your food court configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetToDefaults} disabled={saving}>
              <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
            </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
            </Button>
          </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
            <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
            </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Business Information Tab */}
      {activeTab === 'business' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={settings.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="Business Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="info@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+44 20 1234 5678"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={settings.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Street Address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                value={settings.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of your business"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Hours Tab */}
      {activeTab === 'hours' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            
            <div className="space-y-3">
              {settings.businessHours.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-32">
                    <span className="font-medium">{day.day}</span>
                  </div>
                  
            <div className="flex items-center gap-2">
              <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => updateBusinessHours(index, 'isOpen', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  
                  {day.isOpen && (
                    <>
                      <Input
                        type="time"
                        value={day.open}
                        onChange={(e) => updateBusinessHours(index, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm">to</span>
                      <Input
                        type="time"
                        value={day.close}
                        onChange={(e) => updateBusinessHours(index, 'close', e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                  
                  {!day.isOpen && (
                    <Badge variant="outline" className="ml-auto">Closed</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax & Payment Tab */}
      {activeTab === 'payment' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Tax & Payment Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => updateField('taxRate', parseFloat(e.target.value))}
                />
                <p className="text-xs text-gray-500">VAT/Sales tax percentage</p>
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Payment Methods</h4>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.acceptCash}
                    onChange={(e) => updateField('acceptCash', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Accept Cash</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.acceptCard}
                    onChange={(e) => updateField('acceptCard', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Accept Card</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.acceptOnlinePayment}
                    onChange={(e) => updateField('acceptOnlinePayment', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Accept Online Payment</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Order Amount (£)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.minimumOrderAmount}
                  onChange={(e) => updateField('minimumOrderAmount', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Estimated Prep Time (minutes)</Label>
                <Input
                  type="number"
                  min="0"
                  value={settings.estimatedPrepTime}
                  onChange={(e) => updateField('estimatedPrepTime', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateField('emailNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Enable Email Notifications</span>
                </label>
                
                {settings.emailNotifications && (
                  <div className="ml-6 space-y-2">
                    <Label>Order Notification Email</Label>
                    <Input
                      type="email"
                      value={settings.orderNotificationEmail}
                      onChange={(e) => updateField('orderNotificationEmail', e.target.value)}
                      placeholder="orders@example.com"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.lowStockNotifications}
                    onChange={(e) => updateField('lowStockNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Enable Low Stock Notifications</span>
                </label>
                
                {settings.lowStockNotifications && (
                  <div className="ml-6 space-y-2">
                    <Label>Low Stock Threshold</Label>
                    <Input
                      type="number"
                      min="0"
                      value={settings.lowStockThreshold}
                      onChange={(e) => updateField('lowStockThreshold', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">Alert when stock falls below this level</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Feature Toggles</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Online Ordering</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Allow customers to place orders online</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableOnlineOrdering}
                  onChange={(e) => updateField('enableOnlineOrdering', e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Inventory Tracking</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Track stock levels for menu items</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableInventoryTracking}
                  onChange={(e) => updateField('enableInventoryTracking', e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Loyalty Program</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reward customers for repeat orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableLoyaltyProgram}
                  onChange={(e) => updateField('enableLoyaltyProgram', e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Customer Reviews</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Allow customers to leave reviews</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableCustomerReviews}
                  onChange={(e) => updateField('enableCustomerReviews', e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  type="url"
                  value={settings.facebookUrl || ''}
                  onChange={(e) => updateField('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  type="url"
                  value={settings.instagramUrl || ''}
                  onChange={(e) => updateField('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Twitter URL</Label>
                <Input
                  type="url"
                  value={settings.twitterUrl || ''}
                  onChange={(e) => updateField('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/yourpage"
                />
          </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default SettingsPanel;
