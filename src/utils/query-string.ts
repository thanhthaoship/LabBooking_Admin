export function toQueryString<T>(params: T): string {
  return Object.entries(params as object)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
