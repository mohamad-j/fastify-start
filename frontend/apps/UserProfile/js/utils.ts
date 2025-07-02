export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function createLogger(context: string): Logger {
  return {
    info(message: string): void {
      console.log(`[INFO] [${context}] ${message}`);
    },
    warn(message: string): void {
      console.warn(`[WARN] [${context}] ${message}`);
    },
    error(message: string): void {
      console.error(`[ERROR] [${context}] ${message}`);
    }
  };
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}