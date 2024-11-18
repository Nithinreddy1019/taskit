import { nanoid } from "nanoid";

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// To generate invite code
export const generateInviteCode = (length: number): string => {
  const uniqueString = nanoid(length);
  return uniqueString;
}


// To transform the date using date-fns
export const formatDateFromIso = (date: string) => {
  const dateObject = parseISO(JSON.parse(date));
  const formattedDate = format(dateObject, "d eee, MMM yyyy")

  return formattedDate;
}


// To change from enum to string
export const enumToDisplayText = <T extends string>(enumValue: T): string => {
  const words = enumValue.toLowerCase().split('_');
  return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}