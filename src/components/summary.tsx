import * as React from "react";
import { Store } from "../store";

export default function Summary({ store }: { store: Store }) {
  return (
    <div className="card-wrapper">
      <div className="card"><h3>全動画 合計時間</h3><p>{store.displayData.totalVideoDuration}</p></div>
      <div className="card"><h3>合計 高評価数</h3><p>{store.displayData.totalLikeCount}</p></div>
      <div className="card"><h3>合計動画数</h3><p>{store.displayData.totalVideoCount}</p></div>
      <div className="card"><h3>合計 コメント数</h3><p>{store.displayData.totalCommentCount}</p></div>
    </div>
  );
};

