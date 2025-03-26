import * as React from "react";
import List from "./list"
import Summary from "./summary"
import Channel from "./channle"
import { Store, StoreClass, Video } from "../store";
import { off } from "process";

function TableRow({ video }: { video: Video }) {
  return (
    <tr>
      <th>{video.snippet.publishedAt}</th>
      <th>{video.snippet.title}</th>
      <td>{video.statistics.viewCount}</td>
      <td>{video.statistics.likeCount}</td>
      <td>{video.statistics.commentCount}</td>
      <td>{video.likePerView}</td>
      <td>{video.commentPerView}</td>
    </tr>
  )
}

export default function Result({ store, storeclass, setStore }: { store: Store, storeclass: StoreClass, setStore: any }) {

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

  type SortStatus = "OFF" | "Descend" | "Ascend"
  const [likeSort, setLikeSort] = React.useState<SortStatus>("OFF")
  const sortLike = () => {
    switch (likeSort) {
      case "OFF":
        console.log('off -> descend')
        sortLikeDecend();
        setLikeSort("Descend")
        break;
      case "Descend":
        console.log('descend -> ascend')
        sortLikeAscend();
        setLikeSort("Ascend")
        break;
      case "Ascend":
        console.log('ascend -> descend')
        sortLikeDecend();
        setLikeSort("Descend")
        break;
    }
    console.log(`likeSort: ${likeSort}`)
  }

  return (
    <div className="result">
      <Channel channelResources={store.fetchedData.channelResources} />
      <Summary store={store} />

      {/*
      {store.fetchedData.videoResources.map((resources) => (
        <List item={resources} key={resources.id} />
      ))}
      */}
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
      <table className="result-table">
        <thead>
          <th>公開日</th>
          <th>タイトル</th>
          <th>視聴</th>
          <th onClick={sortLike}>高評価</th>
          <th>コメント</th>
          <th>高評価/視聴</th>
          <th>コメント/視聴</th>
        </thead>
        <tbody>
          {store.fetchedData.videoResources.map((resources) => (
            <TableRow video={resources} key={resources.id} />
          ))}
        </tbody>
      </table>

      <div className="blocker" data-isshow="false">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  );
};

