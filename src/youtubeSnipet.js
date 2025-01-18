/**************************************************************
 ***********                              *********************
 ##########* YouTUbeDataAPIv3にまつわる関数
 **********                              **********************
 *************************************************************/

const API_KEY = import.meta.env.VITE_API_KEY;

/*########################################*
 ** クライアントライブラリを読み込む
 * @returns void
 *
 * https://github.com/google/google-api-javascript-client/blob/master/docs/start.md
 ########################################*/
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      },
    );
}

/******************************************
 * gapi初期化処理が終わるまで待機する
 * @returns void
 *****************************************/
async function init() {
  return new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      await loadClient();
      resolve();
    });
  });
}

/**************************************************************
 ***********                               ********************
 *********** storeに保存するデータをfetchする
 ***********  @returns {void}
 ***********                              *********************
 *************************************************************/
async function fetchAllResources(inputText, store) {
  const elemValidationMessage = document.querySelector(".validation-message");
  try {
    // 1. チャンネル情報を取得する
    let temp = await fetchChannelResourcesWithChannelId(inputText);
    store.fetchedData.channelResources = temp[0];

    // 2. 全動画のIDを取得する
    temp = await fetchAllVideoWithPlaylistId(
      // このプレイリストには全体公開されているすべての動画IDが含まれると推察される
      store.fetchedData.channelResources.contentDetails.relatedPlaylists
        .uploads,
    );

    // 3. 全動画情報を取得する
    temp = await fetchVideoResourcesWithVideoId(temp);
    store.fetchedData.videoResources = temp.flat();
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

/**
 * チャンネル情報の取得
 * @param {string} channelId
 * @returns {array} チャンネル情報
 *
 * https://developers.google.com/youtube/v3/docs/channels?hl=ja
 */
async function fetchChannelResourcesWithChannelId(channelId) {
  if (!channelId) {
    throw new Error(
      "Channel ID Is not exist. Please Input YouTube Channel ID.",
    );
  }

  if (!channelIdValidation(channelId)) {
    throw new Error("Channel ID is not Correct.");
  }

  const res = await gapi.client.youtube.channels.list({
    part: ["snippet,contentDetails,statistics"],
    id: [channelId],
  });

  if (res.status !== 200) {
    console.log(res);
    throw new Error("Network Error. Statuc Code is not 200.");
  }

  if (!res.result.items) {
    console.log(res);
    throw new Error("Requested Channel has no Video.");
  }

  const channelResource = res.result.items;

  return channelResource;

  function channelIdValidation(id) {
    if (id.slice(0, 2) !== "UC") return false;
    if (id.length !== 24) return false;
    return true;
  }
}

/**
 * videoidを元に再帰的にvideoの詳細を取得する
 * @param {array[string]} videoIdArray
 * @returns {array}
 *
 * https://developers.google.com/youtube/v3/docs/videos?hl=ja
 */
async function fetchVideoResourcesWithVideoId(videoIdArray) {
  const options = {
    part: ["snippet,contentDetails,statistics"],
    id: [],
  };

  // 50件ごとに一つの配列としてリクエストする
  videoIdArray = videoIdArray.reduce(nestAry50, []);
  const newAry = await Promise.all(
    videoIdArray.map(async (innerAry) => {
      // optionsを変えて取得
      const ids = [];
      ids.push(innerAry.join());
      options.id = ids;
      const res = await gapi.client.youtube.videos.list(options);
      return res.result.items;
    }),
  );
  return newAry;

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
}

/**
 * 指定したプレイリストに含まれる全動画の動画IDを取得する
 * @param {string} playlistId
 * @param {string|null} pageToken
 * @returns {array[string]} 動画IDのリスト
 *
 * https://developers.google.com/youtube/v3/docs/playlists?hl=ja
 */
async function fetchAllVideoWithPlaylistId(playlistId, pageToken = "") {
  if (!playlistId) {
    throw new Error("Not Exist User Video List");
  }
  const options = {
    part: ["snippet,contentDetails"],
    maxResults: 50,
    playlistId: playlistId,
  };
  if (pageToken) {
    options.pageToken = pageToken;
  }
  const res = await gapi.client.youtube.playlistItems.list(options);
  // 動画IDのみを切り出してarrayを作る
  const temp = res.result.items.map((item) => item.contentDetails.videoId);
  if (!res.result.nextPageToken) {
    return temp;
  }
  return temp.concat(
    await fetchAllVideoWithPlaylistId(playlistId, res.result.nextPageToken),
  );
}

export { init, fetchAllResources };
