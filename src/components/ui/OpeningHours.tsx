import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface OpeningHoursProps {
  restaurant: 'oh-smash' | 'wonder-wings' | 'okra-green' | 'all';
  className?: string;
}

export const OpeningHours: React.FC<OpeningHoursProps> = ({ restaurant, className = '' }) => {
  const getOpeningHours = () => {
    switch (restaurant) {
      case 'oh-smash':
      case 'wonder-wings':
        return {
          name: restaurant === 'oh-smash' ? 'Oh Smash' : 'Wonder Wings',
          hours: [
            { day: 'Monday', open: '3:00 PM', close: '10:00 PM' },
            { day: 'Tuesday', open: '3:00 PM', close: '10:00 PM' },
            { day: 'Wednesday', open: '3:00 PM', close: '10:00 PM' },
            { day: 'Thursday', open: '3:00 PM', close: '10:00 PM' },
            { day: 'Friday', open: '3:00 PM', close: '11:00 PM' },
            { day: 'Saturday', open: '3:00 PM', close: '11:00 PM' },
            { day: 'Sunday', open: '3:00 PM', close: '10:00 PM' },
          ]
        };
      case 'okra-green':
        return {
          name: 'Okra Green',
          hours: [
            { day: 'Monday', open: '5:00 PM', close: '10:00 PM' },
            { day: 'Tuesday', open: 'Closed', close: '' },
            { day: 'Wednesday', open: '5:00 PM', close: '10:00 PM' },
            { day: 'Thursday', open: '5:00 PM', close: '10:00 PM' },
            { day: 'Friday', open: '5:00 PM', close: '11:00 PM' },
            { day: 'Saturday', open: '5:00 PM', close: '11:00 PM' },
            { day: 'Sunday', open: '5:00 PM', close: '10:00 PM' },
          ]
        };
      case 'all':
        return {
          name: 'All Restaurants',
          hours: [
            { day: 'Monday', open: '3:00 PM', close: '10:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-10PM, Okra Green: 5PM-10PM' },
            { day: 'Tuesday', open: '3:00 PM', close: '10:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-10PM, Okra Green: Closed' },
            { day: 'Wednesday', open: '3:00 PM', close: '10:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-10PM, Okra Green: 5PM-10PM' },
            { day: 'Thursday', open: '3:00 PM', close: '10:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-10PM, Okra Green: 5PM-10PM' },
            { day: 'Friday', open: '3:00 PM', close: '11:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-11PM, Okra Green: 5PM-11PM' },
            { day: 'Saturday', open: '3:00 PM', close: '11:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-11PM, Okra Green: 5PM-11PM' },
            { day: 'Sunday', open: '3:00 PM', close: '10:00 PM', note: 'Oh Smash & Wonder Wings: 3PM-10PM, Okra Green: 5PM-10PM' },
          ]
        };
      default:
        return { name: 'Restaurant', hours: [] };
    }
  };

  const { name, hours } = getOpeningHours();

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const todayHours = hours.find(h => h.day === currentDay);
    if (!todayHours || todayHours.open === 'Closed') {
      return { isOpen: false, message: 'Closed today' };
    }

    // Simple time comparison (you could make this more sophisticated)
    const isOpen = true; // For now, we'll show the hours and let customers call
    return { 
      isOpen, 
      message: `Open until ${todayHours.close}` 
    };
  };

  const { isOpen, message } = getCurrentStatus();

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {name} Opening Hours
        </CardTitle>
        <div className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hours.map((hour, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="font-medium text-sm">{hour.day}</span>
              <div className="text-right">
                {hour.open === 'Closed' ? (
                  <span className="text-red-600 font-medium">Closed</span>
                ) : (
                  <span className="text-sm">
                    {hour.open} - {hour.close}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>⏳ Last orders:</strong> 15 minutes before closing each day
          </p>
        </div>

        {restaurant === 'all' && (
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <p><strong>🍔 Oh Smash & Wonder Wings:</strong> Mon-Thu 3PM-10PM, Fri-Sat 3PM-11PM, Sun 3PM-10PM</p>
            <p><strong>🥗 Okra Green:</strong> Mon 5PM-10PM, Tue Closed, Wed-Thu 5PM-10PM, Fri-Sat 5PM-11PM, Sun 5PM-10PM</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


