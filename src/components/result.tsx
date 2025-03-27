import * as React from "react";
import { Tooltip } from 'react-tooltip';
import Summary from "./summary"
import Channel from "./channle"
import { SortOrder, SortType, Store, StoreClass, Video } from "../store";

type SortStatus = "OFF" | "Descend" | "Ascend"

function TableRow({ video }: { video: Video }) {
  return (
    <tr>
      <Tooltip id={video.id}>
        <div>{video.snippet.title}</div>
        <div>{video.id}</div>
        <div><img src={video.snippet.thumbnails.default.url} /></div>
      </Tooltip>
      <th>{video.snippet.publishedAt}</th>
      <td data-tooltip-id={video.id} >
        <a href={`https://`}>
          {video.snippet.title}
        </a>
      </td>
      <td>{video.statistics.viewCount}</td>
      <td>{video.statistics.likeCount}</td>
      <td>{video.statistics.commentCount}</td>
      <td>{video.likePerView}</td>
      <td>{video.commentPerView}</td>
    </tr>
  )
}

export default function Result({ store, storeclass, setStore }: { store: Store, storeclass: StoreClass, setStore: any }) {

  const sort = (type: SortType, order: SortOrder) => {
    storeclass.sortVideoList(type, order)
    setStore(storeclass.store)
  }
  const cssSortClass: Record<SortStatus, string> = {
    "OFF": 'off',
    "Ascend": "ascend",
    "Descend": "descend"
  }
  const defaultSortOrder: Record<SortType, SortOrder> = {
    View: "OFF",
    Like: "OFF",
    Comment: "OFF",
    LikePerView: "OFF",
    CommentPerView: "OFF"
  }
  const [sortOrder, setSortOrder] = React.useState({ ...defaultSortOrder })

  const clickHandler = (type: SortType) => {
    return () => {
      const currentOrder = sortOrder[type]
      switch (currentOrder) {
        case "OFF":
        case "Ascend":
          sort(type, 'Descend')
          setSortOrder({
            ...defaultSortOrder,
            [type]: "Descend"
          })
          break;
        case "Descend":
          sort(type, 'Ascend')
          setSortOrder({
            ...defaultSortOrder,
            [type]: "Ascend"
          })
          break;
      }
    }
  }

  return (
    <div className="result">
      <Channel channelResources={store.fetchedData.channelResources} />
      <Summary store={store} />

      <table className="result-table">
        <thead>
          <th>公開日</th>
          <th>タイトル</th>
          <th
            className={cssSortClass[sortOrder["View"]]}
            onClick={clickHandler("View")}>

            視聴</th>
          <th
            className={cssSortClass[sortOrder["Like"]]}
            onClick={clickHandler("Like")}>
            高評価</th>
          <th
            className={cssSortClass[sortOrder["Comment"]]}
            onClick={clickHandler("Comment")}>
            コメント</th>
          <th
            className={cssSortClass[sortOrder["LikePerView"]]}
            onClick={clickHandler("LikePerView")}>
            高評価/視聴</th>
          <th
            className={cssSortClass[sortOrder["CommentPerView"]]}
            onClick={clickHandler("CommentPerView")}>
            コメント/視聴</th>
        </thead>
        <tbody>
          {store.fetchedData.videoResources.map((resources,) => (
            <TableRow video={resources} key={resources.id} />
          ))}
        </tbody>
      </table >

      <div className="blocker" data-isshow="false">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </div >
  );
};

export { SortStatus, }
