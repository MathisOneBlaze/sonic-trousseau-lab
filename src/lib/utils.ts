import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate UUID v4 (client-side)
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format date to ISO string
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

// Export submissions to CSV
export function exportToCSV(submissions: any[]): string {
  if (submissions.length === 0) return '';

  const headers = Object.keys(submissions[0]);
  const rows = submissions.map(sub => 
    headers.map(h => {
      const val = sub[h];
      if (typeof val === 'object') return JSON.stringify(val);
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return val;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
