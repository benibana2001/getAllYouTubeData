const Channel = ({ channelResources }) => {
  const { snippet, statistics } = channelResources;

  return (
    <div className="channel channel-are">
      {/* <h2>チャンネル情報</h2> */}
      <div>
        <a>
          <img src={snippet.thumbnails.default.url} />
        </a>
      </div>

      <div>
        <div>チャンネル名: {snippet.title}</div>

        {statistics && <div>総再生数: {statistics.viewCount}</div>}

        {statistics && (
          <div>チャンネル登録者数: {statistics.subscriberCount}</div>
        )}

        <div>公開日: {snippet.publishedAt}</div>
      </div>
    </div>
  );
};

export { Channel };
