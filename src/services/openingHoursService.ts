export type RestaurantKey = 'oh-smash' | 'wonder-wings' | 'okra-green';

export interface DayHours { day: string; open: string; close: string } // use 'Closed' for open

const DEFAULTS: Record<RestaurantKey, DayHours[]> = {
  'oh-smash': [
    { day: 'Monday', open: '15:00', close: '22:00' },
    { day: 'Tuesday', open: '15:00', close: '22:00' },
    { day: 'Wednesday', open: '15:00', close: '22:00' },
    { day: 'Thursday', open: '15:00', close: '22:00' },
    { day: 'Friday', open: '15:00', close: '23:00' },
    { day: 'Saturday', open: '15:00', close: '23:00' },
    { day: 'Sunday', open: '15:00', close: '22:00' },
  ],
  'wonder-wings': [
    { day: 'Monday', open: '15:00', close: '22:00' },
    { day: 'Tuesday', open: '15:00', close: '22:00' },
    { day: 'Wednesday', open: '15:00', close: '22:00' },
    { day: 'Thursday', open: '15:00', close: '22:00' },
    { day: 'Friday', open: '15:00', close: '23:00' },
    { day: 'Saturday', open: '15:00', close: '23:00' },
    { day: 'Sunday', open: '15:00', close: '22:00' },
  ],
  'okra-green': [
    { day: 'Monday', open: '17:00', close: '22:00' },
    { day: 'Tuesday', open: 'Closed', close: 'Closed' },
    { day: 'Wednesday', open: '17:00', close: '22:00' },
    { day: 'Thursday', open: '17:00', close: '22:00' },
    { day: 'Friday', open: '17:00', close: '23:00' },
    { day: 'Saturday', open: '17:00', close: '23:00' },
    { day: 'Sunday', open: '17:00', close: '22:00' },
  ],
};

class OpeningHoursService {
  private storageKey = 'eppingOpeningHours';

  getAll(): Record<RestaurantKey, DayHours[]> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  }

  get(restaurant: RestaurantKey): DayHours[] {
    return this.getAll()[restaurant];
  }

  set(restaurant: RestaurantKey, hours: DayHours[]): void {
    const all = this.getAll();
    all[restaurant] = hours;
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }
}

export const openingHoursService = new OpeningHoursService();


