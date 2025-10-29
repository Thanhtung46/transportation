export async function fetchTransports() {
  // Thay bằng API thật của bạn
  const res = await fetch('https://example.com/api/transports');
  if (!res.ok) throw new Error('Failed to fetch transports');
  return res.json();
}