export const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[INFO] [SERVER] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[WARN] [SERVER] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[ERROR] [SERVER] ${msg}`, ...args),
};
