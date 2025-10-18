import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import OrderKanban from './OrderKanban';
import InteractiveMenuManager from './InteractiveMenuManager';
import InventoryManager from './InventoryManager';
import CustomerManager from './CustomerManager';
import Analytics from './Analytics';
import SettingsPanel from './SettingsPanel';
import OrderTaking from './OrderTaking';
import HoursManager from './HoursManager';
import { adminService, AdminStats } from '@/services/adminService';

export const AdminShell: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Load initial stats
    const loadStats = async () => {
      const stats = await adminService.getStats();
      setAdminStats(stats);
    };
    loadStats();
    
    // Subscribe to real-time updates
    const unsubscribe = adminService.subscribe((stats) => {
      setAdminStats(stats);
    });

    // Real-time updates are automatically started in adminService constructor

    return () => {
      unsubscribe();
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard adminStats={adminStats} />;
      case 'orders':
        return <OrderKanban />;
      case 'menu':
        return <InteractiveMenuManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'customers':
        return <CustomerManager />;
      case 'analytics':
        return <Analytics />;
      case 'order-taking':
        return <OrderTaking />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard adminStats={adminStats} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
};


