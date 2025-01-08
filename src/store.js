/****************************************************
 * 表示に使用するデータを定義・更新
 ***************************************************/
const store = {
  /**
   * 取得した情報をそのまま保持する
   */
  fetchedData: {
    /**
     * チャンネルに関する情報を取得するAPIを叩いた結果を保持する
     */
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

    /**
     * 動画に関する情報を取得するAPIを叩いた結果を保持する
     */
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
  },

  /**
   * 　fetchedDataをもとに算出した値を保持する
   */
  displayData: {
    totalVideoDuration: 0,
    totalVideoCount: 0,
    totalLikeCount: 0,
    totalCommentCount: 0,
  },
};
export { store };
