export function today() {
  const today = new Date();
  return `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${(
    '0' + today.getUTCDate()
  ).slice(-2)}`;
}
