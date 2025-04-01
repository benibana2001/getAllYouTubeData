import { Store, createDefaultStore, InputType, StoreFetchOptions } from "../store";
/**************************************************************
 *********** YouTUbeDataAPIvを使用して3storeに保存するデータをfetchする
 ***********  @returns store: Store
 *************************************************************/
export default async function fetchAllResources(inputText: string, options: StoreFetchOptions): Promise<Store> {
  const newStore = createDefaultStore();
  // 1. チャンネル情報を取得する TODO: name 'temp' is ambiguious
  let temp = await fetchChannelResourcesWithInputValue(inputText, options);

  newStore.fetchedData.channelResources = temp[0];

  // 2. 全動画のIDを取得する
  temp = await fetchAllVideoWithPlaylistId(
    // このプレイリストには全体公開されているすべての動画IDが含まれると推察される
    newStore.fetchedData.channelResources.contentDetails.relatedPlaylists
      .uploads,
  );

  // 3. 全動画情報を取得する
  temp = await fetchVideoResourcesWithVideoId(temp);
  newStore.fetchedData.videoResources = temp.flat();
  return newStore;
}

/**
 * チャンネル情報の取得
 * https://developers.google.com/youtube/v3/docs/channels?hl=ja
 */
async function fetchChannelResourcesWithInputValue(inputValue: string, { inputType }: StoreFetchOptions) {


  let res;
  if (inputType === 'channelID') {
    if (!inputValue) {
      throw new Error(
        " ChannelID Is not exist. Please Input YouTube Channel ID.",
      );
    }

    if (!channelIdValidation(inputValue)) {
      throw new Error("Channel ID is not Correct.");
    }
    res = await gapi.client.youtube.channels.list({
      part: ["snippet,contentDetails,statistics"],
      id: [inputValue],
    });
  }

  if (inputType === 'handleName') {
    if (!inputValue) {
      throw new Error(
        " HandleName Is not exist. Please Input YouTube Channel ID.",
      );
    }
    res = await gapi.client.youtube.channels.list({
      part: ["snippet,contentDetails,statistics"],
      forHandle: inputValue,
    });
  }



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

  function channelIdValidation(id: string) {
    if (id.slice(0, 2) !== "UC") return false;
    if (id.length !== 24) return false;
    return true;
  }
}

/**
 * videoidを元に再帰的にvideoの詳細を取得する
 *
 * https://developers.google.com/youtube/v3/docs/videos?hl=ja
 */
async function fetchVideoResourcesWithVideoId(videoIdArray: string[][]) {
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

  /**
   * reducer
   * @template T
   * 50件ずつの配列として配列をネストする
   * @returns
   */
  function nestAry50<T>(accum: T[][], current: T, index: number) {
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
 * https://developers.google.com/youtube/v3/docs/playlists?hl=ja
 */
async function fetchAllVideoWithPlaylistId(playlistId: string, pageToken = "") {
  if (!playlistId) {
    throw new Error("Not Exist User Video List");
  }

  const options = {
    part: ["snippet,contentDetails"],
    maxResults: 50,
    playlistId: playlistId,
  };
  if (pageToken) {
    options["pageToken"] = pageToken;
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

