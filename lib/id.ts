export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export function isoNow(): string {
  return new Date().toISOString();
}
