export type MachineStatus = 'Normal' | 'Warning' | 'Critical'

export interface Machine {
  id: string
  name: string
  icon: string
  risk: number
  status: MachineStatus
  summary: string
  trend: number[]
  vibration: number
  temperature: number
  currentDraw: number
  acoustic: number
  projectedFailureDays: number
  contributingFactors: string[]
  recommendedAction: string
  riskHistory: number[]
  thresholds: {
    warning: number
    critical: number
  }
}

export interface AlertItem {
  id: string
  timestamp: string
  machineId: string
  severity: Exclude<MachineStatus, 'Normal'>
  title: string
  message: string
  values: {
    vibration: number
    temperature: number
    currentDraw: number
    acoustic: number
  }
}

export const machines: Machine[] = [
  {
    id: 'compressor-01',
    name: 'Compressor 01',
    icon: '⚙️',
    risk: 82,
    status: 'Critical',
    summary: 'Bearing vibration is accelerating and temperature is climbing.',
    trend: [4.1, 4.3, 4.9, 5.8, 6.3, 7.1],
    vibration: 7.2,
    temperature: 91,
    currentDraw: 124,
    acoustic: 95,
    projectedFailureDays: 4.2,
    contributingFactors: ['Vibration trend (primary)', 'Bearing temperature (secondary)'],
    recommendedAction: 'Schedule a bearing inspection and lubrication service within 5 days.',
    riskHistory: [28, 36, 49, 61, 73, 82],
    thresholds: { warning: 60, critical: 80 },
  },
  {
    id: 'conveyor-07',
    name: 'Conveyor 07',
    icon: '🛠️',
    risk: 54,
    status: 'Warning',
    summary: 'Motor current is trending above nominal load for the week.',
    trend: [3.2, 3.4, 3.6, 3.9, 4.1, 4.3],
    vibration: 4.8,
    temperature: 78,
    currentDraw: 118,
    acoustic: 81,
    projectedFailureDays: 9.6,
    contributingFactors: ['Current draw pattern', 'Ambient heat increase'],
    recommendedAction: 'Inspect motor coupling and verify belt tension this week.',
    riskHistory: [19, 24, 31, 41, 49, 54],
    thresholds: { warning: 55, critical: 75 },
  },
  {
    id: 'pump-12',
    name: 'Pump 12',
    icon: '💧',
    risk: 21,
    status: 'Normal',
    summary: 'Operating within expected envelope with stable pressure.',
    trend: [2.1, 2.2, 2.2, 2.3, 2.4, 2.4],
    vibration: 2.3,
    temperature: 64,
    currentDraw: 87,
    acoustic: 68,
    projectedFailureDays: 28,
    contributingFactors: ['Baseline stability', 'No abnormal load pattern'],
    recommendedAction: 'Keep routine maintenance cadence unchanged.',
    riskHistory: [12, 15, 16, 18, 20, 21],
    thresholds: { warning: 55, critical: 75 },
  },
]

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    timestamp: '2026-07-06 08:15',
    machineId: 'compressor-01',
    severity: 'Critical',
    title: 'Bearing vibration spike',
    message: 'Vibration crossed the critical threshold during the early shift.',
    values: { vibration: 7.2, temperature: 91, currentDraw: 124, acoustic: 95 },
  },
  {
    id: 'a2',
    timestamp: '2026-07-05 17:40',
    machineId: 'conveyor-07',
    severity: 'Warning',
    title: 'Motor load increase',
    message: 'Current draw rose steadily after a belt tension adjustment.',
    values: { vibration: 4.8, temperature: 78, currentDraw: 118, acoustic: 81 },
  },
  {
    id: 'a3',
    timestamp: '2026-07-04 12:00',
    machineId: 'pump-12',
    severity: 'Warning',
    title: 'Pressure fluctuation',
    message: 'Minor pressure variance was detected during pump start-up.',
    values: { vibration: 2.3, temperature: 64, currentDraw: 87, acoustic: 68 },
  },
]

export function getMachineStatus(risk: number): MachineStatus {
  if (risk >= 70) return 'Critical'
  if (risk >= 40) return 'Warning'
  return 'Normal'
}

export function getRiskTone(risk: number): string {
  if (risk >= 70) return '#fb7185'
  if (risk >= 40) return '#f59e0b'
  return '#34d399'
}

export function getRiskClasses(risk: number): string {
  if (risk >= 70) return 'border-rose-500/30 bg-rose-500/10 text-rose-200'
  if (risk >= 40) return 'border-amber-500/30 bg-amber-500/10 text-amber-200'
  return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
}
