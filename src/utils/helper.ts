export function ellipsis(string: string, start = 8, end = 4) {
  if (!string) return "";
  return `${string.substring(0, start)}...${string.substring(
    string.length - end
  )}`;
}
