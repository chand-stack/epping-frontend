import React, { useEffect, useState } from 'react';
import { openingHoursService, type DayHours, type RestaurantKey } from '@/services/openingHoursService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HoursManager: React.FC = () => {
  const [restaurant, setRestaurant] = useState<RestaurantKey>('oh-smash');
  const [hours, setHours] = useState<DayHours[]>(openingHoursService.get(restaurant));

  useEffect(() => {
    setHours(openingHoursService.get(restaurant));
  }, [restaurant]);

  const update = (index: number, field: 'open' | 'close', value: string) => {
    const copy = [...hours];
    copy[index] = { ...copy[index], [field]: value };
    setHours(copy);
  };

  const save = () => {
    openingHoursService.set(restaurant, hours);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Restaurant:</span>
        <select className="border rounded p-2" value={restaurant} onChange={(e)=>setRestaurant(e.target.value as RestaurantKey)}>
          <option value="oh-smash">OhSmash</option>
          <option value="wonder-wings">Wonder Wings</option>
          <option value="okra-green">Okra Green</option>
        </select>
      </div>

      <Card className="border">
        <CardContent className="p-4 space-y-3">
          {hours.map((h, idx) => (
            <div key={h.day} className="grid grid-cols-3 gap-3 items-center">
              <div className="font-medium">{h.day}</div>
              <input className="border rounded p-2" value={h.open} onChange={(e)=>update(idx, 'open', e.target.value)} placeholder="HH:MM or Closed"/>
              <input className="border rounded p-2" value={h.close} onChange={(e)=>update(idx, 'close', e.target.value)} placeholder="HH:MM or Closed"/>
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={save}>Save Hours</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HoursManager;


