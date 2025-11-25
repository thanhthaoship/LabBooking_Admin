export function bodyString(params?: Record<string, any>): string {
  if (!params) return '';

  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return JSON.stringify(filteredParams);
}