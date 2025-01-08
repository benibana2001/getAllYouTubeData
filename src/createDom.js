/****************************************************
 * パースした値を元にDOMを作る
 ***************************************************/
import {
  hmsArraytoInt,
  parseDurationForDisplay,
  parseDurationStrToAry,
  replaceHMS,
} from "./utilFunctions";

const elemViewArea = document.querySelector(".view-area");
const elemBaseInfoArea = document.querySelector(".base-info-area");
const elemForm = document.querySelector("form");

/**
 * 結果画面を作成する
 */
function createResultViewWithVideoList(store) {
  store.displayData.totalVideoCount = store.fetchedData.videoResources.length;

  // Formエリアを非表示
  elemForm.dataset.visible = "hidden";

  // 動画リストのDOMを作成
  store.fetchedData.videoResources.map((item) =>
    createVideoList(elemViewArea, item),
  );

  // 合計時間を表示
  elemBaseInfoArea.appendChild(
    createCard("全動画 合計時間", store.displayData.totalVideoDuration),
  );
  // 総合 高評価数
  elemBaseInfoArea.appendChild(
    createCard("合計 高評価数", store.displayData.totalLikeCount),
  );
  // 総合 コメント数
  elemBaseInfoArea.appendChild(
    createCard("合計 コメント数", store.displayData.totalCommentCount),
  );
  // 全動画の数を表示
  elemBaseInfoArea.appendChild(
    createCard("合計動画数", store.displayData.totalVideoCount),
  );
}
function createCard(title, duration) {
  const div = document.createElement("div");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  div.className = "card";
  h3.textContent = title;
  p.textContent = duration;
  div.appendChild(h3);
  div.appendChild(p);
  return div;
}
const createLiSpan = (tag, text, parent, liclass = null) => {
  const li = document.createElement("li");
  if (liclass) li.className = liclass;
  const span = document.createElement("span");
  li.textContent = tag;
  span.textContent = text;
  li.appendChild(span);
  parent.appendChild(li);
  return li;
};

const createA = (tag, text, parent, href, className = null) => {
  const a = document.createElement("a");
  if (className) a.className = className;
  a.href = href;
  a.target = "_blank";
  const span = document.createElement("span");
  a.textContent = tag;
  span.textContent = text;
  a.appendChild(span);
  parent.appendChild(a);
  return a;
};

const createLi = (parent, liclass = null) => {
  const li = document.createElement("li");
  if (liclass) li.className = liclass;
  parent.appendChild(li);
  return li;
};

function createVideoList(parent, item) {
  const videoLink = `https://www.youtube.com/watch?v=${item.id}`;

  const elemOuterList = createLi(parent, "list-outer");
  const elemFlexRight = createLi(elemOuterList);
  const elemFlexLeft = createA("", "", elemOuterList, videoLink);

  const elemMain = createLi(elemFlexRight);
  const elemMisc = createLi(elemFlexRight, "video-misc");

  createA(" ", item.snippet.title, elemMain, videoLink, "video-title");
  createLiSpan("公開日: ", item.snippet.publishedAt, elemMain);
  createLiSpan(
    "再生時間: ",
    parseDurationForDisplay(item.contentDetails.duration),
    elemMain,
  );
  createLiSpan("視聴回数: ", `${item.statistics.viewCount} 回`, elemMain);
  createLiSpan("👍: ", item.statistics.likeCount, elemMisc);
  createLiSpan("💬: ", item.statistics.commentCount, elemMisc);

  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = item.snippet.thumbnails.high.url;
  li.appendChild(img);
  elemFlexLeft.appendChild(li);
}

export { createResultViewWithVideoList };
