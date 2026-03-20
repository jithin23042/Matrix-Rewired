export interface WorkerProfile {
  name: string;
  city: string;
  platform: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  avgHourlyEarnings: number;
}

export interface InsuranceStatus {
  active: boolean;
  weeklyPremium: number;
  riskScore: number;
}

export interface WeatherConditions {
  rainfall: { status: 'clear' | 'light' | 'heavy'; mm: number };
  floodAlert: boolean;
  curfew: boolean;
}

export interface WorkerActivity {
  online: boolean;
  ordersAccepted: number;
  ordersCompleted: number;
}

export interface TriggerEvent {
  detected: boolean;
  type: string;
  duration: number; // minutes
  eligible: boolean;
}

export interface PayoutRecord {
  id: string;
  date: string;
  event: string;
  duration: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
}

export const mockWorker: WorkerProfile = {
  name: 'Rahul Sharma',
  city: 'Mumbai',
  platform: 'Swiggy',
  workingHoursStart: '10:00',
  workingHoursEnd: '22:00',
  avgHourlyEarnings: 150,
};

export const mockInsurance: InsuranceStatus = {
  active: true,
  weeklyPremium: 45,
  riskScore: 62,
};

export const mockConditions: WeatherConditions = {
  rainfall: { status: 'clear', mm: 0 },
  floodAlert: false,
  curfew: false,
};

export const mockActivity: WorkerActivity = {
  online: true,
  ordersAccepted: 18,
  ordersCompleted: 15,
};

export const mockPayouts: PayoutRecord[] = [
  { id: '1', date: '2026-03-10', event: 'Heavy Rain', duration: '3h 20m', amount: 500, status: 'completed' },
  { id: '2', date: '2026-03-03', event: 'Flood Alert', duration: '5h 00m', amount: 750, status: 'completed' },
  { id: '3', date: '2026-02-25', event: 'Heavy Rain', duration: '2h 10m', amount: 325, status: 'completed' },
  { id: '4', date: '2026-02-18', event: 'Curfew', duration: '8h 00m', amount: 1200, status: 'completed' },
];
