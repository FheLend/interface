export function ellipsis(string: string, start = 8, end = 4) {
  if (!string) return "";
  return `${string.substring(0, start)}...${string.substring(
    string.length - end
  )}`;
}

export function filterNumberInput(event: any, value: string, preVal: string) {
  let strRemoveText = value.replace(/[^0-9.]/g, "");
  let str = strRemoveText.replace(/\./g, (val, i) => {
    if (strRemoveText.indexOf(".") !== i) val = "";
    return val;
  });

  if (str === ".") str = "0.";

  event.target.value = str;

  return preVal !== str;
}
