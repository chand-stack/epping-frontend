import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuHeader } from './MenuHeader';
import { MenuLayout, type MenuCategoryData } from './MenuLayout';
import { cn } from '@/lib/utils';

interface CombinedMenuTabsProps {
  ohSmashMenu: MenuCategoryData[];
  wonderWingsMenu: MenuCategoryData[];
  okraGreenMenu: MenuCategoryData[];
}

type TabType = 'oh-smash' | 'wonder-wings' | 'okra-green';

export const CombinedMenuTabs: React.FC<CombinedMenuTabsProps> = ({
  ohSmashMenu,
  wonderWingsMenu,
  okraGreenMenu,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('oh-smash');

  const tabs = [
    {
      id: 'oh-smash' as const,
      label: 'OhSmash',
      brand: 'OhSmash' as const,
      menu: ohSmashMenu,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-600',
    },
    {
      id: 'wonder-wings' as const,
      label: 'Wonder Wings',
      brand: 'Wonder Wings' as const,
      menu: wonderWingsMenu,
      color: 'bg-amber-800',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-800',
    },
    {
      id: 'okra-green' as const,
      label: 'Okra Green',
      brand: 'Okra Green' as const,
      menu: okraGreenMenu,
      color: 'bg-green-800',
      textColor: 'text-green-800',
      borderColor: 'border-green-800',
    },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Layout with left sidebar housing brand switcher */}
      {currentTab && (
        <div className="bg-white">
          {/* Menu Header for current tab */}
          <div className="py-6">
            <MenuHeader restaurant={activeTab} />
          </div>

          {/* Menu with left-side brand switcher injected above categories */}
          <div className="pt-2 pb-12 bg-secondary">
            <MenuLayout
              brand={currentTab.brand}
              categories={currentTab.menu}
              leftExtra={(
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Switch Restaurant</p>
                  <div className="grid grid-cols-1 gap-2">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        className={cn(
                          'w-full justify-start',
                          activeTab === tab.id ? '' : 'bg-white'
                        )}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedMenuTabs;
