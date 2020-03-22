export const hex2rgba = (hex, opacity) => {
  const parsedHex = hex.replace('#', '');
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  return result;
};
