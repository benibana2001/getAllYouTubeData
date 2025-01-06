import "./style.css";
import {
  init,
  fetchChannelResourcesWithChannelId,
  fetchVideoResourcesWithVideoId,
  fetchAllVideoWithPlaylistId
} from "./youtubeSnipet.js";
import { DEBUG_VIDEO_LIST } from "./debug.js";

let DEBUG = false;

// 外部script読み込み待機
document.addEventListener("DOMContentLoaded", async (event) => {
  await init();

  const elemForm = document.querySelector("form");
  const elemSearchButton = document.querySelector("[data-func='search");
  const elemValidationMessage = document.querySelector(".validation-message");
  const elemBlocker = document.querySelector(".blocker");
  const elemViewArea = document.querySelector(".view-area");
  const elemBaseInfoArea = document.querySelector(".base-info-area")

  // DOMのデバッグにはモックを使用する
  if (DEBUG) {
    const videoList = DEBUG_VIDEO_LIST;
    createResultViewWithVideoList(videoList); // 結果を元にDOMレンダリング
  }

  elemSearchButton.addEventListener("click", requestYouTubeAndCreateResultView);

  // Loaderの表示
  document.addEventListener("busy", (event) => {
    if (event.detail) {
      elemBlocker.dataset.busy = "true";
    } else {
      elemBlocker.dataset.busy = "false";
    }
  });

  async function requestYouTubeAndCreateResultView() {
    const videoList = await execAllFetchAndParseVideoResourcesList(); // 通信処理
    createResultViewWithVideoList(videoList); // 結果を元にDOMレンダリング
  }

  /**
   * 動画情報が詰まったリストを返す
   * @returns [[string]]
   */
  async function execAllFetchAndParseVideoResourcesList() {
    // すべての動画情報
    let videoResourcesArray = null;

    const inputText = elemForm.elements.channelid.value;

// ユーザー操作ブロック
    document.dispatchEvent(new CustomEvent("busy", { detail: true }));

    try {
      // チャンネル情報を取得する
      const channelResources = await fetchChannelResourcesWithChannelId(inputText);

      // プレイリストのIDをパースする.
      // このプレイリストには全体公開されているすべての動画IDが含まれると推察される
      const playlistId =
        channelResources[0].contentDetails.relatedPlaylists.uploads;

      // 動画のIDを取得する
      const videoIdArray = await fetchAllVideoWithPlaylistId(playlistId);

      // 全動画情報を取得する
      videoResourcesArray = await fetchVideoResourcesWithVideoId(videoIdArray);

    } catch (err) {
      console.error(err);
      elemValidationMessage.textContent = err.message;

      return;

    } finally {
      // ユーザーブロック解除
      document.dispatchEvent(new CustomEvent("busy", { detail: false }));
    }

    const videoList = videoResourcesArray.flat();

    // エラーメッセージを削除
    if (elemValidationMessage.textContent) {
      elemValidationMessage.textContent = "";
    }

    return videoList;
  }

  /**
   * 結果画面を作成する
   * @param {[[string]]} videoList 
   */
  function createResultViewWithVideoList(videoList) {
    const channelInfo = {
      id: "",
      name: "",
      thumbnailURL: ""
    }
    let totalVideoDuration = 0;
    let totalVideoCount = videoList.length;
    let totalLikeCount = 0;
    let totalCommentCount = 0;

    // Formエリアを非表示
    elemForm.dataset.visible = "hidden";

    // 動画リストのDOMを作成
    videoList.map((item) => createVideoList(elemViewArea, item));

    // 総合計時間を計測
    totalVideoDuration = videoList.reduce((accum, item) => {
      const duration = item.contentDetails.duration;
      const ary = parseDurationStrToAry(duration);
      const num = hmsArraytoInt(ary); // H, M, S表記を Sの一つにまとめる
      return accum + num;
    }, 0);

    // 合計LIKE数を計測
    totalLikeCount = videoList.reduce((accum, item) => {
      const count = parseInt(item.statistics.likeCount)
      return accum + count
    }, 0)

    // 合計コメント数を計測
    totalCommentCount = videoList.reduce((accum, item) => {
      let count = 0
      if(item.statistics.commentCount) {
        count = parseInt(item.statistics.commentCount)
      }

      if(!item.statistics.commentCount) {
        console.log(item)
      }

      return accum +count
    }, 0)

    // 総合計時間を自然言語にパース
    totalVideoDuration = replaceHMS(intToHmsArray(totalVideoDuration).join(""));

    // 合計時間を表示
    elemBaseInfoArea.appendChild( createCard("全動画 合計時間", totalVideoDuration))
    // 総合 高評価数
    elemBaseInfoArea.appendChild(createCard("合計 高評価数", totalLikeCount))
    // 総合 コメント数
    elemBaseInfoArea.appendChild(createCard("合計 コメント数", totalCommentCount))
    // 全動画の数を表示
    elemBaseInfoArea.appendChild( createCard("合計動画数", totalVideoCount ))

    function createCard(title, duration) {
      const div = document.createElement('div')
      const h3 = document.createElement('h3')
      const p =document.createElement('p')
      div.className = 'card'
      h3.textContent = title
      p.textContent = duration
      div.appendChild(h3)
      div.appendChild(p)
      return div
    }
}
});

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


// Duration Parser
/**
 * 整数として与えられた秒数ををH, M, Sの時間表記に変更する
 * @param {number} num 
 * @returns {[string]}
 */
function intToHmsArray(num) {
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
 * @param {*} hmsArray 
 * @returns {number}
 */
function hmsArraytoInt(hmsArray) {
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
 * @param {string} str 
 * @returns {string}
 */
function parseDurationForDisplay(str) {
  const ary = parseDurationStrToAry(str);
  if (ary.length >= 2) ary.pop();
  return replaceHMS(ary.join(""));
}

// 先頭の文字列"PT"をトリムし、残った"5H"や"30S"のような時間表記をスプリットして返す
function parseDurationStrToAry(str) {
  return str.replace(/^PT/, "").match(/[0-9]*[A-Z]/g);
}

// 日本語表記に変更する
function replaceHMS(str) {
  return str.replace(/H/, "時間").replace(/M/, "分").replace(/S/, "秒");
}
