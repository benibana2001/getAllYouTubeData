import "./style.css";
import { init, fetchAllResources } from "./youtubeSnipet";
import { DEBUG_VIDEO_LIST, DEBUG_CHANNEL_RESOURCES } from "./debug.js";
import { createResultViewWithVideoList } from "./createDom";
import { store } from "./store";
import { loader } from "./loader";
import { parseFetchedData } from "./parse";

/****************************************************
                                           
                       DEBUG                
                                           
 ***************************************************/
let DEBUG = false;
if (DEBUG) {
  store.fetchedData.channelResources = DEBUG_CHANNEL_RESOURCES[0];
  store.fetchedData.videoResources = DEBUG_VIDEO_LIST;
  createResultViewWithVideoList(store); // 結果を元にDOMレンダリング
}

const elemForm = document.querySelector("form");
const elemSearchButton = document.querySelector("[data-func='search");

document.addEventListener("DOMContentLoaded", async (event) => {
  // 外部script読み込み待機
  await init();

  // Loaderの初期化
  loader();

  // YouTUbeにリクエストを投げて画面を作る
  elemSearchButton.addEventListener("click", requestYouTubeAndCreateResultView);
});

/****************************************************
  
          * YouTUbeにリクエストを投げて画面を作る
          
***************************************************/
async function requestYouTubeAndCreateResultView() {
  // ユーザー操作ブロック
  document.dispatchEvent(new CustomEvent("busy", { detail: true }));

  // 通信処理を行いstoreに保存
  await fetchAllResources(elemForm.elements["channelid"].value, store);

  // fetchしたデータをパースして保持
  parseFetchedData(store);

  // Formエリアを非表示
  elemForm.dataset.visible = "hidden";

  // ユーザーブロック解除
  document.dispatchEvent(new CustomEvent("busy", { detail: false }));

  // 結果を元にDOMレンダリング
  createResultViewWithVideoList(store);
}
