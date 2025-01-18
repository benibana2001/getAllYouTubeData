import {
  parseDurationStrToAry,
  hmsArraytoInt,
  intToHmsArray,
  replaceHMS,
} from "./utilFunctions";

/**
 ***************************************************
                                                    
             fetchしたデータをパースして保持           
             @param {*} store                     
                                                    
 ***************************************************
 */
async function parseFetchedData(store) {
  const displayData = store.displayData;
  const fetchedData = store.fetchedData;

  // 総合計時間を計測
  displayData.totalVideoDuration = fetchedData.videoResources.reduce(
    (accum, item) => {
      const duration = item.contentDetails.duration;
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
      const count = parseInt(item.statistics.likeCount);
      return accum + count;
    },
    0,
  );

  // 合計コメント数を計測
  displayData.totalCommentCount = fetchedData.videoResources.reduce(
    (accum, item) => {
      let count = 0;
      if (item.statistics.commentCount) {
        count = parseInt(item.statistics.commentCount);
      }

      if (!item.statistics.commentCount) {
        console.log(item);
      }

      return accum + count;
    },
    0,
  );
}

export { parseFetchedData };
