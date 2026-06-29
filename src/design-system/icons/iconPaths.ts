export type IconName =
  | 'home'
  | 'search'
  | 'user'
  | 'bell'
  | 'message'
  | 'map'
  | 'location'
  | 'camera'
  | 'image'
  | 'plus'
  | 'check'
  | 'close'
  | 'arrowLeft'
  | 'arrowRight'
  | 'chevronRight'
  | 'lock'
  | 'phone'
  | 'mail'
  | 'eye'
  | 'eyeOff'
  | 'star'
  | 'clock'
  | 'creditCard'
  | 'receipt'
  | 'tools'
  | 'plumbing'
  | 'locksmith'
  | 'electricity'
  | 'airConditioning'
  | 'car'
  | 'document'
  | 'warning'
  | 'success'
  | 'error';

export interface IconPathConfig {
  paths: string[];
  lines?: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  circles?: Array<{ cx: number; cy: number; r: number }>;
}

export const iconPaths: Record<IconName, IconPathConfig> = {
  home: { paths: ['M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z'] },
  search: { paths: ['M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Z'], lines: [{ x1: 16, y1: 16, x2: 21, y2: 21 }] },
  user: { paths: ['M20 21a8 8 0 0 0-16 0', 'M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z'] },
  bell: { paths: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z', 'M13.7 21a2 2 0 0 1-3.4 0'] },
  message: { paths: ['M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z'] },
  map: { paths: ['M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z', 'M9 3v15', 'M15 6v15'] },
  location: { paths: ['M12 22s7-6.1 7-12A7 7 0 0 0 5 10c0 5.9 7 12 7 12Z'], circles: [{ cx: 12, cy: 10, r: 2.5 }] },
  camera: { paths: ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11Z'], circles: [{ cx: 12, cy: 13, r: 4 }] },
  image: { paths: ['M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z', 'M3 16l5-5 4 4 3-3 6 6'] },
  plus: { paths: [], lines: [{ x1: 12, y1: 5, x2: 12, y2: 19 }, { x1: 5, y1: 12, x2: 19, y2: 12 }] },
  check: { paths: ['M20 6 9 17l-5-5'] },
  close: { paths: [], lines: [{ x1: 18, y1: 6, x2: 6, y2: 18 }, { x1: 6, y1: 6, x2: 18, y2: 18 }] },
  arrowLeft: { paths: ['M19 12H5', 'M12 19l-7-7 7-7'] },
  arrowRight: { paths: ['M5 12h14', 'M12 5l7 7-7 7'] },
  chevronRight: { paths: ['M9 18l6-6-6-6'] },
  lock: { paths: ['M6 10V8a6 6 0 0 1 12 0v2', 'M5 10h14v11H5V10Z'] },
  phone: { paths: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z'] },
  mail: { paths: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 6-10 7L2 6'] },
  eye: { paths: ['M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z'], circles: [{ cx: 12, cy: 12, r: 3 }] },
  eyeOff: { paths: ['M17.9 17.9A10.8 10.8 0 0 1 12 19C5 19 1 12 1 12a20.3 20.3 0 0 1 5.1-5.9', 'M9.9 4.2A10.7 10.7 0 0 1 12 4c7 0 11 8 11 8a20.4 20.4 0 0 1-2.2 3.2', 'M2 2l20 20'] },
  star: { paths: ['m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z'] },
  clock: { paths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'] },
  creditCard: { paths: ['M2 6h20v12H2V6Z', 'M2 10h20'] },
  receipt: { paths: ['M4 2v20l3-2 3 2 3-2 3 2 3-2 1 1V2H4Z', 'M8 7h8', 'M8 11h8', 'M8 15h5'] },
  tools: { paths: ['M14.7 6.3a4 4 0 0 0 5 5L11 20l-4-4 8.7-8.7Z', 'M6 2l4 4-4 4-4-4 4-4Z'] },
  plumbing: { paths: ['M4 7h10v4H4V7Z', 'M14 9h3a3 3 0 0 1 3 3v1', 'M7 11v8', 'M5 19h4', 'M18 17c2 2 2 4 0 5-2-1-2-3 0-5Z'] },
  locksmith: { paths: ['M7 11V8a5 5 0 0 1 10 0v3', 'M5 11h14v10H5V11Z', 'M12 15v3'] },
  electricity: { paths: ['M13 2 4 14h7l-1 8 10-13h-7l0-7Z'] },
  airConditioning: { paths: ['M4 5h16v8H4V5Z', 'M8 17h8', 'M9 21l3-4 3 4', 'M7 9h10'] },
  car: { paths: ['M5 13l2-5h10l2 5', 'M3 13h18v6H3v-6Z'], circles: [{ cx: 7, cy: 18, r: 1.5 }, { cx: 17, cy: 18, r: 1.5 }] },
  document: { paths: ['M14 2H6v20h12V6l-4-4Z', 'M14 2v4h4', 'M8 13h8', 'M8 17h6'] },
  warning: { paths: ['M12 2 2 22h20L12 2Z', 'M12 9v5', 'M12 18h.01'] },
  success: { paths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M8 12l3 3 5-6'] },
  error: { paths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M15 9l-6 6', 'M9 9l6 6'] },
};
