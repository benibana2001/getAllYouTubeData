import * as React from "react";
import { loaderInit, LoaderEvent } from "../loader";
import Result from "./result";
import { StoreClass } from "../store";

export default function App() {

  React.useEffect(() => {
    // Loaderアイコンの初期化
    loaderInit();

    // @ts-ignore
    if (__DEBUG__) {
      console.log(`** DEBUG MODE **`)
    }
  }, [])

  const storeclass = React.useMemo(
    () => new StoreClass(),
    []
  )
  const [inputValue, setInputValue] = React.useState("")
  const [store, setStore] = React.useState(storeclass.store);



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  async function requestYouTube() {
    document.dispatchEvent(
      new LoaderEvent("busy", {
        detail: { type: "LoadingChannel", isUiLock: true },
      })
    );

    // 通信処理を行いstoreに保存
    await storeclass.fetch(inputValue)
    setStore(storeclass.store)

    console.log(storeclass)
    // ユーザーブロック解除
    document.dispatchEvent(
      new LoaderEvent("busy", {
        detail: { type: "LoadingChannel", isUiLock: false },
      })

    );
  }

  const hasStore = React.useMemo(
    () => !!store.fetchedData.channelResources, [store]
  )

  const removeStore = () => {
    storeclass.resetStore()
    setStore(storeclass.store)
  }

  const sortStore = () => {
    // LikeCountを比較する
    const comparefunc = (a: gapi.client.youtube.Video, b: gapi.client.youtube.Video) => {
      return (parseInt(a.statistics.likeCount) - parseInt(b.statistics.likeCount))
    }
    storeclass.sortVideoList(comparefunc)
    setStore(storeclass.store)
  }

  return (
    <div className="">
      {/* 通信結果がまだないときだけ表示する */}
      {!hasStore &&
        <form>
          <h1>GET ALL YOUTUBE VIDEOS FOR A SPECIFIC USER</h1>
          <div>
            <input
              name="channelid"
              type="text"
              value={inputValue}
              placeholder="チャンネルID"
              onChange={handleChange}
            />
            <input
              className="button-search"
              type="button"
              data-func="search"
              value="SEARCH"
              onClick={requestYouTube}
            />
          </div>
          <p className="validation-message"></p>
        </form>
      }

      <button onClick={removeStore}>Close</button>
      <button onClick={sortStore}>Sort</button>
      <button onClick={() => { console.log(storeclass) }}>ConsoleStoreclass</button>
      {hasStore && <Result store={store} />}


      <div className="blocker" data-isshow="false">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  );
};

