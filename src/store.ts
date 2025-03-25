import fetchAllResources from "./lib/youtubeSnipet";
import parseFetchedData from "./parse";

type ChannelID = string
type Video = gapi.client.youtube.Video & {
  likePerView?: number
  commentPerView?: number
}
type Store = {
  /**
   * 取得した情報をそのまま保持する
   */
  fetchedData: {
    /**
     * チャンネルに関する情報を取得するAPIを叩いた結果を保持する
     */
    channelResources: gapi.client.youtube.Channel | null;

    /**
     * 動画に関する情報を取得するAPIを叩いた結果を保持する
     */
    videoResources: Video[] | null;
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


const createDefaultStore = () => {
  return {
    fetchedData: {
      channelResources: null,
      videoResources: null,
    },

    displayData: {
      totalVideoDuration: 0,
      totalVideoCount: 0,
      totalLikeCount: 0,
      totalCommentCount: 0,
    }
  }
}

type CompareFuncName = 'likeAscend' | 'likeDecend' | 'commentAscend' | 'commentDescend' | 'likePerViewAscend' | 'likePerViewDescend' | 'commentPerViewAscend' | 'commentPerViewDescend'

const compareFunc = (name: CompareFuncName) => {
  switch (name) {
    case 'likeAscend': {
      return (a: gapi.client.youtube.Video, b: gapi.client.youtube.Video) => {
        return (parseInt(a.statistics.likeCount) - parseInt(b.statistics.likeCount))
      }
    }

    case 'likeDecend': {
      return (a: gapi.client.youtube.Video, b: gapi.client.youtube.Video) => {
        return (- parseInt(a.statistics.likeCount) + parseInt(b.statistics.likeCount))
      }
    }
    case 'commentAscend': {
      return (a: gapi.client.youtube.Video, b: gapi.client.youtube.Video) => {
        return (parseInt(a.statistics.commentCount) - parseInt(b.statistics.commentCount))
      }
    }
    case 'commentDescend': {
      return (a: gapi.client.youtube.Video, b: gapi.client.youtube.Video) => {
        return (- parseInt(a.statistics.commentCount) + parseInt(b.statistics.commentCount))
      }
    }
    case 'likePerViewAscend': {
      return (a: Video, b: Video) => {
        return (a.likePerView - b.likePerView)
      }
    }
    case 'likePerViewDescend': {
      return (a: Video, b: Video) => {
        return (- (a.likePerView) + (b.likePerView))
      }
    }
    case 'commentPerViewAscend': {
      return (a: Video, b: Video) => {
        return (a.commentPerView - b.commentPerView)
      }
    }
    case 'commentPerViewDescend': {
      return (a: Video, b: Video) => {
        return (- (a.commentPerView) + (b.commentPerView))
      }
    }
  }
}

type InputType = "channelID" | "handleName";
type StoreFetchOptions = {
  inputType: InputType
}

class StoreClass {
  #store: Store;
  get store() { return this.#store }
  set store(store: Store) {
    this.#store = store
  }
  constructor() {
    this.resetStore()
  }
  resetStore() {
    console.log('reset store')
    this.#store = createDefaultStore()
  }
  sortVideoList(name: CompareFuncName) {
    if (this.#store.fetchedData.videoResources.length > 0) {
      const newList = [...this.#store.fetchedData.videoResources]
      newList.sort(compareFunc(name));
      this.#store = {
        fetchedData: {
          ...this.#store,
          ...this.#store.fetchedData,
          videoResources: newList,
        },
        displayData: {
          ...this.#store.displayData
        }
      }
    }
  }
  async fetch(id: ChannelID, options?: StoreFetchOptions) {
    const res = await fetchAllResources(id, options)
    this.#store = await parseFetchedData(res)
  }
}

export { Store, Video, StoreClass, createDefaultStore, InputType, StoreFetchOptions };
