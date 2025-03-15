import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(number);
}

export function isActivePage(currentPath: string, pagePath: string): boolean {
  if (pagePath === '/' && currentPath === '/') {
    return true;
  }
  return pagePath !== '/' && currentPath.startsWith(pagePath);
}

export const demoPagesPaths = ['/nexus', '/one-click-tools'];

export function isDemoPage(path: string): boolean {
  return demoPagesPaths.includes(path);
}
