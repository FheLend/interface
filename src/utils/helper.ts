import { get } from "lodash";
import BN from "bignumber.js";

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

export function getError(error: any) {
  return (
    get(error, "error.message") ||
    get(error, "info.error.message") ||
    get(error, "shortMessage") ||
    get(error, "reason") ||
    get(error, "message")
  );
}

export function formatSmallNumber(number: string | number, decimals = 3) {
  if (Number(number) >= 1) {
    return Number(number).toLocaleString();
  }
  const toPrecision = new BN(number).toPrecision(decimals);
  return new BN(toPrecision).toFixed();
}
