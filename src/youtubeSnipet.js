const API_KEY = "AIzaSyDe5lfxi4wDETz9EcfBTztdHMnErSRU7KM";

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

async function execChannel(channelId) {
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

  console.log(res);
  return res;

  function channelIdValidation(id) {
    if (id.slice(0, 2) !== "UC") return false;
    if (id.length !== 24) return false;
    return true;
  }
}

// ネストされたvideoidを元に再起的にvideoの詳細を取得する
async function execVideosListRecursively(nestedAry) {
  const options = {
    part: ["snippet,contentDetails,statistics"],
    id: [],
  };
  const newAry = await Promise.all(
    nestedAry.map(async (innerAry) => {
      // optionsを変えて取得
      const ids = [];
      ids.push(innerAry.join());
      options.id = ids;
      const res = await gapi.client.youtube.videos.list(options);
      return res.result.items;
    }),
  );
  return newAry;
}

async function execPlaylistItemsRecursively(playlistId, pageToken = "") {
  if(!playlistId) {
    throw new Error('Not Exist User Video List')
  }
  console.log("execPlaylistItemRecursively");
  const options = {
    part: ["snippet,contentDetails"],
    maxResults: 50,
    playlistId: playlistId,
  };
  if (pageToken) {
    options.pageToken = pageToken;
  }
  const res = await gapi.client.youtube.playlistItems.list(options);
  const temp = res.result.items.map((item) => item.contentDetails.videoId);
  if (!res.result.nextPageToken) {
    return temp;
  }
  return temp.concat(
    await execPlaylistItemsRecursively(playlistId, res.result.nextPageToken),
  );
}

async function init() {
  return new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      await loadClient();
      resolve();
    });
  });
}

export {
  init,
  execVideosListRecursively,
  execChannel,
  execPlaylistItemsRecursively,
};
