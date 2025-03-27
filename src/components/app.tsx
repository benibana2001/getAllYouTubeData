import * as React from "react";
import Result from "./result";
import Loader from "./loader"
import { StoreClass, StoreFetchOptions } from "../store";
import FormArea from './form'
import 'react-tooltip/dist/react-tooltip.css'

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

  return (
    <div className="">

      {/* 通信結果がまだないときだけ表示する */}
      {!hasStore && <FormArea requestYouTube={requestYouTube} />}

      <div>
        <button onClick={removeStore}>Close</button>
      </div>

      <div>
        <button onClick={() => { console.log(storeclass) }}>ConsoleStoreclass</button>
      </div>

      <div>
        {hasStore && <Result store={store} storeclass={storeclass} setStore={setStore} />}
      </div>

      <Loader isShow={loaderShow} />
    </div>
  );
};

