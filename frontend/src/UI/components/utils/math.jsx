export const safeNumber = (value) => {
  if (value === undefined || value === null) return 0;
  if (isNaN(value) || !isFinite(value)) return 0;
  return value;
};
