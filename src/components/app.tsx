import * as React from "react";
import Result from "./result";
import Loader from "./loader"
import { StoreClass, StoreFetchOptions } from "../store";
import FormArea from './form'

export default function App() {

  React.useEffect(() => {
    // @ts-ignore
    if (__DEBUG__) {
      console.log(`** DEBUG MODE **`)
    }
  }, [])

  const storeclass = React.useMemo(
    () => new StoreClass(),
    []
  )
  const [store, setStore] = React.useState(storeclass.store);
  const [loaderShow, setLoaderShow] = React.useState(false)

  async function requestYouTube(value: string, options: StoreFetchOptions) {
    setLoaderShow(true)
    // 通信処理を行いstoreに保存
    await storeclass.fetch(value, options)
    setStore(storeclass.store)

    // ユーザーブロック解除
    setLoaderShow(false)
  }

  const hasStore = React.useMemo(
    () => !!store.fetchedData.channelResources, [store]
  )

  const removeStore = () => {
    storeclass.resetStore()
    setStore(storeclass.store)
  }

  const sortLikeAscend = () => {
    storeclass.sortVideoList('likeAscend')
    setStore(storeclass.store)
  }
  const sortLikeDecend = () => {
    storeclass.sortVideoList('likeDecend')
    setStore(storeclass.store)
  }
  const sortCommentCountAscend = () => {
    storeclass.sortVideoList('commentAscend')
    setStore(storeclass.store)
  }
  const sortCommentCountDescend = () => {
    storeclass.sortVideoList('commentDescend')
    setStore(storeclass.store)
  }
  const sortLikePerViewAscend = () => {
    storeclass.sortVideoList('likePerViewAscend')
    setStore(storeclass.store)
  }
  const sortLikePerViewDescend = () => {
    storeclass.sortVideoList('likePerViewDescend')
    setStore(storeclass.store)
  }
  const sortCommentPerViewAscend = () => {
    storeclass.sortVideoList('commentPerViewAscend')
    setStore(storeclass.store)
  }
  const sortCommentPerViewDescend = () => {
    storeclass.sortVideoList('commentPerViewDescend')
    setStore(storeclass.store)
  }


  return (
    <div className="">

      {/* 通信結果がまだないときだけ表示する */}
      {!hasStore && <FormArea requestYouTube={requestYouTube} />}

      <div>
        <button onClick={removeStore}>Close</button>
      </div>

      <div>
        <button onClick={sortLikeAscend}>sortLikeAscend</button>
        <button onClick={sortLikeDecend}>sortLikeDecend</button>
        <button onClick={sortCommentCountAscend}>sortCommentAscend</button>
        <button onClick={sortCommentCountDescend}>sortCommentCountDescend</button>
        <button onClick={sortLikePerViewAscend}>sortLikePerViewAscend</button>
        <button onClick={sortLikePerViewDescend}>sortLikePerViewDescend</button>
        <button onClick={sortCommentPerViewAscend}>sortLikePerViewAscend</button>
        <button onClick={sortCommentPerViewDescend}>sortCommentPerViewDescend</button>
      </div>

      <div>
        <button onClick={() => { console.log(storeclass) }}>ConsoleStoreclass</button>
        {hasStore && <Result store={store} />}
      </div>

      <Loader isShow={loaderShow} />
    </div>
  );
};

