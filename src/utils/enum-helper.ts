// Helper function to get enum key from enum value
export const getEnumKey = <T>(
  enumObj: T,
  value: string
): string | undefined => {
  return Object.keys(enumObj!).find((key) => enumObj[key as keyof T] === value);
};
