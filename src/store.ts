type Store = {
  /**
   * 取得した情報をそのまま保持する
   */
  fetchedData: {
    /**
     * チャンネルに関する情報を取得するAPIを叩いた結果を保持する
     */
    channelResources: gapi.client.youtube.Channel;

    /**
     * 動画に関する情報を取得するAPIを叩いた結果を保持する
     */
    videoResources: gapi.client.youtube.Video[];
  };
  /**
   * 表示に使用する計算結果を保持
   * fetchedDataをもとに算出した値を保持する
   */
  displayData: {
    totalVideoDuration: number;
    totalVideoCount: number;
    totalLikeCount: number;
    totalCommentCount: number;
  };
};

const store: Store = {
  fetchedData: {
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
        },
        contentDetails: {},
      },
      {},
    ],
  },

  displayData: {
    totalVideoDuration: 0,
    totalVideoCount: 0,
    totalLikeCount: 0,
    totalCommentCount: 0,
  },
};
export { store, Store };
