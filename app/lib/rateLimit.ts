const requests = new Map<string, number[]>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = requests.get(key) || [];
  const recent = timestamps.filter(
    (timestamp) => timestamp > windowStart
  );

  if (recent.length >= maxRequests) {
    requests.set(key, recent);
    return false;
  }

  recent.push(now);
  requests.set(key, recent);

  return true;
}
