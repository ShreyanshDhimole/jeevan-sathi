
export const POINTS_KEY = "user_points";

export function getPoints(): number {
  const value = localStorage.getItem(POINTS_KEY);
  return value ? Number(value) : 0;
}

export function setPoints(points: number) {
  localStorage.setItem(POINTS_KEY, points.toString());
  // To notify other tabs/windows, fire a storage event
  window.dispatchEvent(new StorageEvent("storage", {
    key: POINTS_KEY,
    newValue: points.toString(),
  }));
}

/**
 * Listen to point changes from localStorage and call the callback with new value.
 */
export function subscribeToPointsChange(cb: (points: number) => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === POINTS_KEY && e.newValue !== null) {
      cb(Number(e.newValue));
    }
  };
  window.addEventListener("storage", handler);
  // Return an unsubscribe cleanup
  return () => window.removeEventListener("storage", handler);
}
