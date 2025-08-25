import { parseISO, format } from "date-fns";
import { Store } from "./store";
import {
  parseDurationStrToAry,
  hmsArraytoInt,
  intToHmsArray,
  replaceHMS,
} from "./utilFunctions";

/**
 ***************************************************
                                                    
             fetchしたデータをパースして保持           
                                                    
 ***************************************************
 */
export default async function parseFetchedData(store: Store): Promise<Store> {
  const newStore = { ...store };
  const displayData = newStore.displayData;
  const fetchedData = newStore.fetchedData;

  // 総合計時間を計測
  displayData.totalVideoDuration = fetchedData.videoResources.reduce(
    (accum, item) => {
      const duration = item.contentDetails?.duration;
      const ary = parseDurationStrToAry(duration);
      const num = hmsArraytoInt(ary); // H, M, S表記を Sの一つにまとめる
      return accum + num;
    },
    0,
  );

  // 総合計時間を自然言語にパース
  displayData.totalVideoDurationString = replaceHMS(
    intToHmsArray(displayData.totalVideoDuration).join(""),
  );

  // 合計LIKE数を計測
  displayData.totalLikeCount = fetchedData.videoResources.reduce(
    (accum, item) => {
      let count = 0;
      if (item.statistics?.likeCount) {
        count = parseInt(item.statistics.likeCount);
      }
      return accum + count;
    },
    0,
  );

  // 合計コメント数を計測
  displayData.totalCommentCount = fetchedData.videoResources.reduce(
    (accum, item) => {
      let count = 0;
      if (item.statistics?.commentCount) {
        count = parseInt(item.statistics.commentCount);
      }

      return accum + count;
    },
    0,
  );
  // 合計動画数を計算
  displayData.totalVideoCount = fetchedData.videoResources.length;

  // 日付フォーマットの変更
  fetchedData.videoResources.forEach((video) => {
    video.snippet.publishedAt = format(
      parseISO(video.snippet.publishedAt),
      "yyyy年MM月dd日",
    );
  });

  // 1再生数あたりのいいね数を計算
  fetchedData.videoResources.forEach((video) => {
    video.likePerView = divideByString(
      video.statistics.likeCount,
      video.statistics.viewCount,
      1,
    );

    video.commentPerView =
      video.statistics.commentCount && video.statistics.viewCount
        ? String(
            Math.floor(
              (parseInt(video.statistics.commentCount) /
                parseInt(video.statistics.viewCount)) *
                10000,
            ) / 100,
          )
        : "-";
  });

  /**
   * 文字列を数字に変換して計算
   * a / b
   * exp: 小数点以下の桁数を整数で指定
   */
  function divideByString(a: string, b: string, exp: number = 0): string {
    if (exp < 0) throw new Error("argument is invalid");
    const intA = parseInt(a);
    const intB = parseInt(b);
    /* 0除算の防止 */
    if (!intB) return "-";
    /* 分子が0の場合は即時リターン */
    if (intA === 0) return "0";
    if (!intA) return "-";

    exp = 10 ** exp;
    return (
      String(Math.floor((parseInt(a) / parseInt(b)) * 100 * exp) / exp) + "%"
    );
  }

  return newStore;
}
