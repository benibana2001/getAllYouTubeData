import "./style.css";
import {
  init,
  execChannel,
  execPlaylistItemsRecursively,
  execVideosListRecursively,
} from "./youtubeSnipet.js";

// 外部script読み込み待機
document.addEventListener("DOMContentLoaded", async (event) => {
  await init();

  const elemForm = document.querySelector("form");
  const elemSearchButton = document.querySelector("[data-func='search");
  const elemValidationMessage = document.querySelector(".validation-message");
  const elemBlocker = document.querySelector(".blocker");

  elemSearchButton.addEventListener("click", requestYouTubeAndCreateResultView);
  // elemSearchButton.addEventListener("click", requestYoutubeAPIs);

  document.addEventListener("busy", (event) => {
    if (event.detail) {
      elemBlocker.dataset.busy = "true";
    } else {
      elemBlocker.dataset.busy = "false";
    }
  });

  async function requestYouTubeAndCreateResultView() {
    const videoList = await requestYoutubeAPIs(); // 通信処理
    createResultView(videoList); // 結果を元にDOMレンダリング
  }

  async function requestYoutubeAPIs() {
    const text = elemForm.elements.channelid.value;

    // videolistのIDを取得
    let res;
    try {
      // ユーザー操作ブロック
      document.dispatchEvent(new CustomEvent("busy", { detail: true }));
      res = await execChannel(text);

      const playlistId =
        res.result.items[0].contentDetails.relatedPlaylists.uploads;
      res = await execPlaylistItemsRecursively(playlistId);

      const parsedVideoIds = res.reduce(nestAry50, []);
      res = await execVideosListRecursively(parsedVideoIds);
    } catch (err) {
      console.error(err);
      elemValidationMessage.textContent = err.message;
      // ユーザーブロック解除
      document.dispatchEvent(new CustomEvent("busy", { detail: false }));
      return;
    }

    const videoList = res.flat();

    //全通信処理成功
    document.dispatchEvent(new CustomEvent("busy", { detail: false }));

    // エラーメッセージを削除
    if (elemValidationMessage.textContent) {
      elemValidationMessage.textContent = "";
    }
    return videoList;
  }

  function createResultView(videoList) {
    let totalVideoDuration = 0;
    let totalVideoCount = videoList.length;
    // Formエリアを非表示
    elemForm.dataset.visible = "hidden";

    // 動画リストのDOMを作成
    videoList.map((item) => createVideoList(item));

    // 総合計時間を計測
    totalVideoDuration = videoList.reduce((accum, item) => {
      const duration = item.contentDetails.duration;
      const ary = parseDurationStrToAry(duration);
      const num = hmsArraytoInt(ary); // H, M, S表記を Sの一つにまとめる
      return accum + num;
    }, 0);

    // 総合計時間を自然言語にパース
    totalVideoDuration = replaceHMS(intToHmsArray(totalVideoDuration).join(""));

    // PRINT DEBUG
    const style = "color: green;font-weight:bold;font-size:2em;";
    console.log(`総動画本数： %c${totalVideoCount} %c本`, style, "");
    console.log(`総再生時間： %c${totalVideoDuration}`, style);
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

function createVideoList(item) {
  const elemTarget = document.querySelector(".view-area");

  const videoLink = `https://www.youtube.com/watch?v=${item.id}`;

  const elemOuterList = createLi(elemTarget, "list-outer");
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

// 50件ずつの配列として配列をネストする
function nestAry50(accum, current, index) {
  if (index % 50 === 0) {
    // あまりが０の時は配列を作成する
    const newNest = [current];
    accum.push(newNest);
    return accum;
  }
  accum[accum.length - 1].push(current);
  return accum;
}

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

function intToHmsArray(num) {
  let h, m, s;
  h = Math.floor(num / 60 / 60);
  num -= h * 60 * 60;
  m = Math.floor(num / 60);
  num -= m * 60;
  s = num;
  return [`${h}H`, `${m}M`, `${s}S`];
}

function parseDurationForDisplay(str) {
  const ary = parseDurationStrToAry(str);
  if (ary.length >= 2) ary.pop();
  return replaceHMS(ary.join(""));
}

function parseDurationStrToAry(str) {
  return str.replace(/^PT/, "").match(/[0-9]*[A-Z]/g);
}

function replaceHMS(str) {
  return str.replace(/H/, "時間").replace(/M/, "分").replace(/S/, "秒");
}
