export const safeNumber = (value) => {
  if (value === undefined || value === null) return 0;
  if (isNaN(value) || !isFinite(value)) return 0;
  return Number(value);
};



export function floorAndFormat(value, maxDecimals = 6) {
  if (!value) return "0";
  // Find the exponent of the number
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, exponent - (maxDecimals - 1));
  const floored = Math.floor(value / factor) * factor;
  // Format as string with up to maxDecimals
  return floored.toFixed(maxDecimals).replace(/\.?0+$/, "");
}

export function formatFixed(value, digits = 6) {
  const val = safeNumber(value);
  if (val == 0) return 0;
  console.log("val: ", val);
  return val.toFixed(digits);
}

export function format(value, digits = 6) {
  if (value === "" || value === null || value === undefined) return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  if (num === 0) return "0";
  return num.toFixed(digits);
}

export function displayFormat(value) {
  let str = String(value);

  if (str.includes(".")) {
    str = str.replace(/^0*(?=\d*\.)/, "");
    if (str.startsWith(".")) str = "0" + str;
  } else {
    str = str; 
  }

  return Number(str);
}
