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
  const newStore = { ...store }
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
  displayData.totalVideoDuration = replaceHMS(
    intToHmsArray(displayData.totalVideoDuration).join(""),
  );

  // 合計LIKE数を計測
  displayData.totalLikeCount = fetchedData.videoResources.reduce(
    (accum, item) => {
      let count = 0;
      if (item.statistics?.likeCount) {
        count = parseInt(item.statistics.likeCount)
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

  // 1再生数あたりのいいね数を計算
  fetchedData.videoResources.forEach((video) => {
    video.likePerView = Math.floor(parseInt(video.statistics.likeCount) / parseInt(video.statistics.viewCount) * 10000) / 100
    video.commentPerView = Math.floor(parseInt(video.statistics.commentCount) / parseInt(video.statistics.viewCount) * 10000) / 100
  })


  return newStore
}

