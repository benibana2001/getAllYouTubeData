import "./style.css";
import {
  init,
  fetchChannelResourcesWithChannelId,
  fetchVideoResourcesWithVideoId,
  fetchAllVideoWithPlaylistId,
} from "./youtubeSnipet.js";
import { DEBUG_VIDEO_LIST, DEBUG_CHANNEL_RESOURCES } from "./debug.js";

let DEBUG = false;

// 外部script読み込み待機
document.addEventListener("DOMContentLoaded", async (event) => {
  await init();

  const elemForm = document.querySelector("form");
  const elemSearchButton = document.querySelector("[data-func='search");
  const elemValidationMessage = document.querySelector(".validation-message");
  const elemBlocker = document.querySelector(".blocker");
  const elemViewArea = document.querySelector(".view-area");
  const elemBaseInfoArea = document.querySelector(".base-info-area");

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
    const fetchedData = {
      // チャンネル情報
      channelResources: {
        snippet: {
          title: "",
          description: "",
          customUrl: "@XXXXXX",
          publishedAt: "YYYY-MM-DDTHH:MM:SS.1234567",
          thumbnails: {
            default: {
              url: "",
              width: 88,
              height: 88,
            },
            medium: {
              url: "",
              width: 240,
              height: 240,
            },
            high: {
              url: "",
              width: 800,
              height: 800,
            },
          },
          defaultLanguage: "ja",
          localized: {
            title: "",
            description: "",
          },
          country: "JP",
        },
        contentDetails: {
          relatedPlaylists: {
            likes: "",
            uploads: "",
          },
        },
      },

      // すべての動画情報
      videoResources: [
        {
          kind: "youtube#playlistItem",
          etag: "",
          id: "",
          snippet: {
            publishedAt: "",
            channelId: "",
            title: "",
            description: "",
            thumbnails: {
              default: {
                url: "",
                width: 120,
                height: 90,
              },
              medium: {
                url: "",
                width: 320,
                height: 180,
              },
              high: {
                url: "",
                width: 480,
                height: 360,
              },
              standard: {
                url: "",
                width: 640,
                height: 480,
              },
              maxres: {
                url: "",
                width: 1280,
                height: 720,
              },
            },
            channelTitle: "",
            playlistId: "",
            position: 50,
            resourceId: {
              kind: "youtube#video",
              videoId: "",
            },
            videoOwnerChannelTitle: "",
            videoOwnerChannelId: "",
          },
          contentDetails: {
            videoId: "",
            videoPublishedAt: "YYYY-MM-DDTHH:MM:SSZ",
          },
        },
        {},
      ],
    };

    const displayData = {
      totalVideoDuration: 0,
      totalVideoCount: 0,
      totalLikeCount: 0,
      totalCommentCount: 0,
    };

    // ユーザー操作ブロック
    document.dispatchEvent(new CustomEvent("busy", { detail: true }));
    await fetchAllResources(); // 通信処理

    parseFetchedData();

    // ユーザーブロック解除
    document.dispatchEvent(new CustomEvent("busy", { detail: false }));

    createResultViewWithVideoList(fetchedData.videoResources); // 結果を元にDOMレンダリング

    /**
     * storeに保存するデータをfetchする
     * @returns {void}
     */
    async function fetchAllResources() {
      const inputText = elemForm.elements.channelid.value;

      try {
        // 1. チャンネル情報を取得する
        let temp = await fetchChannelResourcesWithChannelId(inputText);
        fetchedData.channelResources.contentDetails = temp[0].contentDetails;
        fetchedData.channelResources.snippet = temp[0].snippet;

        // 2. 動画のIDを取得する
        temp = await fetchAllVideoWithPlaylistId(
          // このプレイリストには全体公開されているすべての動画IDが含まれると推察される
          fetchedData.channelResources.contentDetails.relatedPlaylists.uploads,
        );

        // 3. 全動画情報を取得する
        temp = await fetchVideoResourcesWithVideoId(temp);
        fetchedData.videoResources = temp.flat();
      } catch (err) {
        console.error(err);
        elemValidationMessage.textContent = err.message;

        return;
      }

      // エラーメッセージを削除
      if (elemValidationMessage.textContent) {
        elemValidationMessage.textContent = "";
      }
    }

    // fetchしたデータをパースして保持
    async function parseFetchedData() {
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

    /**
     * 結果画面を作成する
     * @param {[[string]]} videoList
     */
    function createResultViewWithVideoList(videoList) {
      displayData.totalVideoCount = videoList.length;

      // Formエリアを非表示
      elemForm.dataset.visible = "hidden";

      // 動画リストのDOMを作成
      videoList.map((item) => createVideoList(elemViewArea, item));

      // 合計時間を表示
      elemBaseInfoArea.appendChild(
        createCard("全動画 合計時間", displayData.totalVideoDuration),
      );
      // 総合 高評価数
      elemBaseInfoArea.appendChild(
        createCard("合計 高評価数", displayData.totalLikeCount),
      );
      // 総合 コメント数
      elemBaseInfoArea.appendChild(
        createCard("合計 コメント数", displayData.totalCommentCount),
      );
      // 全動画の数を表示
      elemBaseInfoArea.appendChild(
        createCard("合計動画数", displayData.totalVideoCount),
      );

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
