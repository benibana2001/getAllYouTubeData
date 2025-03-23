import * as React from "react";
import { parseDurationForDisplay } from "../utilFunctions";
import { Video } from "../store";

export default function List({ item }: { item: Video }) {

  const videoLink = `https://www.youtube.com/watch?v=${item.id}`;

  const likePerView = React.useMemo(() => {
    // 小数点以下２ケタまで表示
    return Math.floor(parseInt(item.statistics.likeCount) / parseInt(item.statistics.viewCount) * 10000) / 100
  }, [])
  return (
    <li className="list-outer">
      <div>
        <div>
          <a className="video-title" href={videoLink} target="_blank">
            <span>{item.snippet.title}</span>
          </a>
          <div>公開日: <span>{item.snippet.publishedAt}</span> </div>
          <div>再生時間: <span>{parseDurationForDisplay(item.contentDetails.duration)}</span></div>
          <div>視聴回数: <span>{item.statistics.viewCount}</span></div>
        </div>
        <div className="video-misc">
          <div>👍: <span>{item.statistics.likeCount}</span></div>
          <div>💬: <span>{item.statistics.commentCount}</span></div>
        </div>
        <div className="video-misc">
          <div>いいね数/視聴回数: <span>{item.likePerView}%</span></div>
        </div>
        <div className="video-misc">
          <div>コメント数/視聴回数: <span>{item.commentPerView}%</span></div>
        </div>
      </div>

      <a href={videoLink} target="_blank">
        <span></span>
        <div>
          <img src={item.snippet.thumbnails.high.url} />
        </div>
      </a>
    </li>
  );
};

