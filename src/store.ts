import fetchAllResources from "./lib/youtubeSnipet";
import parseFetchedData from "./parse";

type ChannelID = string
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
    videoResources: gapi.client.youtube.Video[] | null;
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
  sortVideoList(compareFunc) {
    if (this.#store.fetchedData.videoResources.length > 0) {
      const newList = [...this.#store.fetchedData.videoResources]
      newList.sort(compareFunc);
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
  async fetch(id: ChannelID) {
    const res = await fetchAllResources(id)
    this.#store = await parseFetchedData(res)
    console.log(this)
  }
}
export { Store, StoreClass, createDefaultStore };
