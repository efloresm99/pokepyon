export function firstUpper(text: string) {
  const firstUpper = text.charAt(0).toUpperCase() + text.substring(1);
  return firstUpper;
}
