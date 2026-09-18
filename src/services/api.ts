/** API boundary: replace mock store calls with axios calls here when a backend is available. */
export const apiConfig = { baseURL: import.meta.env.VITE_API_URL || "/api" };
export const mockDelay = <T,>(value: T, ms = 250) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms));
