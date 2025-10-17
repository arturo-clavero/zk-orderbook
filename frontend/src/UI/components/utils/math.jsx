export const safeNumber = (value) => {
  if (value === undefined || value === null) return 0;
  if (isNaN(value) || !isFinite(value)) return 0;
  return Number(value);
};

export function format(value, digits = 6) {
  const val = safeNumber(value);
  if (val == 0) return 0;
  console.log("val: ", val);
  return val.toFixed(digits);
}

export function floorAndFormat(value, maxDecimals = 6) {
  if (!value) return "0";
  // Find the exponent of the number
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, exponent - (maxDecimals - 1));
  const floored = Math.floor(value / factor) * factor;
  // Format as string with up to maxDecimals
  return floored.toFixed(maxDecimals).replace(/\.?0+$/, "");
}
