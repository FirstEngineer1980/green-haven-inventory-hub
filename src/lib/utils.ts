
import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatVolume(volumeCm3: number): string {
  if (volumeCm3 < 1000) {
    return `${volumeCm3.toFixed(2)} cm³`;
  }
  
  const volumeLiters = volumeCm3 / 1000;
  if (volumeLiters < 1000) {
    return `${volumeLiters.toFixed(2)} L`;
  }
  
  const volumeM3 = volumeLiters / 1000;
  return `${volumeM3.toFixed(2)} m³`;
}
