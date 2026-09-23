import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts in Indian Rupees (INR - ₹) by default with proper Indian numbering.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "INR",
  options: Intl.NumberFormatOptions = {}
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === null || num === undefined || isNaN(num)) {
    return "₹0";
  }

  if (currency === "INR" || currency === "₹") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      ...options,
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(num);
}

