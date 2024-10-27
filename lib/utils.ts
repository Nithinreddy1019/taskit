import { nanoid } from "nanoid";

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// To generate invite code
export const generateInviteCode = (length: number): string => {
  const uniqueString = nanoid(length);
  return uniqueString;
}