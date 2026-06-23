export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (
    res.headers.get("Content-Type")?.toLowerCase().includes("application/json")
  ) {
    return res.json() as Promise<T>;
  } else {
    return res.text() as Promise<T>;
  }
}
