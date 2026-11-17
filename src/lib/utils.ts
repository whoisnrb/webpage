import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPlaceholderEmail(email?: string | null): boolean {
  if (!email) return true;
  const lower = email.toLowerCase().trim();
  return (
    lower === "" ||
    lower.includes("nincsmeg") ||
    lower.includes("teszt.hu") ||
    lower.endsWith(".internal") ||
    lower.startsWith("placeholder") ||
    lower === "nincs"
  );
}

