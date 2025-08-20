import * as React from "react";
import Result from "./result";
import Loader from "./loader"
import { StoreClass, StoreFetchOptions } from "../store";
import Header from './header'
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
  const [errorMessage, setErrorMessage] = React.useState("")

  async function requestYouTube(value: string, options: StoreFetchOptions) {
    setLoaderShow(true)
    try {
      if (errorMessage) setErrorMessage("") // エラーメッセージがあれば非表示する
      await storeclass.fetch(value, options) // 通信処理を行いstoreに保存
      setStore(storeclass.store)
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
        setErrorMessage(e.message)
      }
    }

    // ユーザーブロック解除
    setLoaderShow(false)
  }

  const hasStore = React.useMemo(
    () => !!store.fetchedData.channelResources, [store]
  )

  return (
    <div className="">
      <Header />

      <main>
        <div className="description">
          <h1>YouTubeチャンネル情報の取得</h1>
          <p>getAllDataYouTubeは、YouTube配信者のハンドルネームをもとに、チャンネルの詳細な情報を取得します。</p>
        </div>
        {/* 検索フォーム */}
        {/* 通信結果がまだないときだけ表示する */}
        {!hasStore && <FormArea requestYouTube={requestYouTube} />}
        {errorMessage && <p className="validation-message">{errorMessage}</p>}

        {/* 検索結果画面 */}
        {hasStore && <Result store={store} storeclass={storeclass} setStore={setStore} />}

      </main >

      <Loader isShow={loaderShow} />
    </div >
  );
};

