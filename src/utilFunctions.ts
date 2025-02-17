import { Events } from "./type";

function addCustomEvent< K extends keyof Events >(
  key: K,
  f: EventListenerOrEventListenerObject
) { 
  document.addEventListener(key, f)
}
/**
 * 整数として与えられた秒数ををH, M, Sの時間表記に変更する
 */
function intToHmsArray(num: number): string[] {
  let h, m, s;
  h = Math.floor(num / 60 / 60);
  num -= h * 60 * 60;
  m = Math.floor(num / 60);
  num -= m * 60;
  s = num;
  return [`${h}H`, `${m}M`, `${s}S`];
}

/**
 *  H ,M,Sの時間表記を秒数に変換する
 */
function hmsArraytoInt(hmsArray: string[]): number {
  let num = 0;
  for (const str of hmsArray) {
    if (str.includes("H")) {
      str.replace(/H/, "");
      num += parseInt(str) * 60 * 60;
    } else if (str.includes("M")) {
      str.replace(/M/, "");
      num += parseInt(str) * 60;
    } else if (str.includes("S")) {
      str.replace(/S/, "");
      num += parseInt(str);
    }
  }
  return num;
}

/**
 *  H ,M,Sの時間表記から「HH時間MM分SS秒」という表記に変える
 */
function parseDurationForDisplay(str:string): string {
  const ary = parseDurationStrToAry(str);
  if(!ary) return ""
  if (ary.length >= 2) ary.pop();
  return replaceHMS(ary.join(""));
}

// 先頭の文字列"PT"をトリムし、残った"5H"や"30S"のような時間表記をスプリットして返す
function parseDurationStrToAry(str:string) {
  return str.replace(/^PT/, "").match(/[0-9]*[A-Z]/g);
}

// 日本語表記に変更する
function replaceHMS(str:string) {
  return str.replace(/H/, "時間").replace(/M/, "分").replace(/S/, "秒");
}

export {
  addCustomEvent,
  intToHmsArray,
  hmsArraytoInt,
  parseDurationForDisplay,
  parseDurationStrToAry,
  replaceHMS,
};
