import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Truck, Store } from 'lucide-react';

type RestaurantKey = 'oh-smash' | 'wonder-wings' | 'okra-green';

interface MenuHeaderProps {
  restaurant: RestaurantKey;
  address?: string;
}

const HOURS: Record<RestaurantKey, { day: string; open: string; close: string }[]> = {
  'oh-smash': [
    { day: 'Monday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Tuesday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Wednesday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Thursday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Friday', open: '3:00 PM', close: '11:00 PM' },
    { day: 'Saturday', open: '3:00 PM', close: '11:00 PM' },
    { day: 'Sunday', open: '3:00 PM', close: '10:00 PM' },
  ],
  'wonder-wings': [
    { day: 'Monday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Tuesday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Wednesday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Thursday', open: '3:00 PM', close: '10:00 PM' },
    { day: 'Friday', open: '3:00 PM', close: '11:00 PM' },
    { day: 'Saturday', open: '3:00 PM', close: '11:00 PM' },
    { day: 'Sunday', open: '3:00 PM', close: '10:00 PM' },
  ],
  'okra-green': [
    { day: 'Monday', open: '5:00 PM', close: '10:00 PM' },
    { day: 'Tuesday', open: 'Closed', close: '' },
    { day: 'Wednesday', open: '5:00 PM', close: '10:00 PM' },
    { day: 'Thursday', open: '5:00 PM', close: '10:00 PM' },
    { day: 'Friday', open: '5:00 PM', close: '11:00 PM' },
    { day: 'Saturday', open: '5:00 PM', close: '11:00 PM' },
    { day: 'Sunday', open: '5:00 PM', close: '10:00 PM' },
  ],
};

function toMinutes(time: string): number {
  if (!time || time === 'Closed') return -1;
  const m = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!m) return -1;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ restaurant, address = '53 High St, Epping' }) => {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);

  useEffect(() => {
    const key = `scheduledOrder:${restaurant}`;
    const saved = localStorage.getItem(key);
    if (saved) setScheduledFor(saved);
  }, [restaurant]);

  const status = useMemo(() => {
    const list = HOURS[restaurant];
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const minutes = now.getHours() * 60 + now.getMinutes();
    const today = list.find((h) => h.day === day);
    if (!today || today.open === 'Closed') return { open: false, banner: 'Closed today' };
    const openMin = toMinutes(today.open);
    const closeMin = toMinutes(today.close);
    const open = minutes >= openMin && minutes < closeMin;
    return {
      open,
      banner: open
        ? `Open now • Last orders 15 min before ${today.close}`
        : `Accepting scheduled orders only. Online ordering resumes at ${today.open}`,
    };
  }, [restaurant]);

  return (
    <div id="menu-info" className="container mx-auto">
      <Card className="rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3">
            {/* Address + quick stats row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>📍 {address}</span>
              <span>•</span>
              <span>⏱️ ~15–25 min</span>
              <span>•</span>
              <span>Delivery: £1.99 (min: £12)</span>
            </div>

            {/* Tabs and actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={mode === 'delivery' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setMode('delivery')}
              >
                <Truck className="w-4 h-4" /> Delivery
              </Button>
              <Button
                variant={mode === 'pickup' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setMode('pickup')}
              >
                <Store className="w-4 h-4" /> Pickup
              </Button>
              <div className="mx-2" />
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowSchedule(true)}>
                <Clock className="w-4 h-4" /> {scheduledFor ? 'Reschedule' : 'Schedule'}
              </Button>
            </div>

            {/* Banner */}
            <div className={`rounded-xl p-3 text-sm ${status.open ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              {scheduledFor ? (
                <span>✅ Scheduled order: {scheduledFor}</span>
              ) : (
                <span>{status.banner}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-5">
            <h3 className="text-lg font-semibold mb-3">Schedule your order</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full border rounded-md p-2" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" className="w-full border rounded-md p-2" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowSchedule(false)}>Cancel</Button>
                <Button onClick={() => {
                  if (!scheduleDate || !scheduleTime) return;
                  const pretty = new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                  const key = `scheduledOrder:${restaurant}`;
                  localStorage.setItem(key, pretty);
                  setScheduledFor(pretty);
                  setShowSchedule(false);
                }}>Save</Button>
              </div>
              {scheduledFor && (
                <button className="text-sm text-red-600 underline" onClick={() => {
                  localStorage.removeItem(`scheduledOrder:${restaurant}`);
                  setScheduledFor(null);
                }}>Clear scheduled order</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuHeader;


