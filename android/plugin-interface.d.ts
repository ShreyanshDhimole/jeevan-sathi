
/**
 * TypeScript plugin interface for the Android ScreenTimePlugin
 * Used with Capacitor's registerPlugin utility in your React app.
 */

export interface AppUsageStat {
  package: string;
  minutes: number;
}

export interface ScreenTimeStatsResult {
  apps: AppUsageStat[];
}

export interface ScreenTimePlugin {
  /**
   * Get app usage stats for a specific date (YYYY-MM-DD).
   */
  getAppUsageStats(options: { date: string }): Promise<ScreenTimeStatsResult>;
  
  /**
   * Get total device screen time for a specific date (YYYY-MM-DD).
   */
  getScreenTime(options: { date: string }): Promise<{ minutes: number }>;

  /**
   * Set daily time limit for a specific app (by package name).
   */
  setScreenTimeLimit(options: { app: string; minutes: number }): Promise<void>;
  /**
   * Get all app time limits.
   */
  getScreenTimeLimits(): Promise<{ [app: string]: number }>;

  /**
   * Listen for "limitExceeded" events: trigger when a limit is exceeded.
   */
  addListener(
    eventName: "limitExceeded",
    cb: (data: { app: string; minutesOver: number }) => void
  ): void;
}
