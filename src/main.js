import "./style.css";
import {
  init,
  execChannel,
  execPlaylistItemsRecursively,
  execVideosListRecursively,
  ROKOCHAN,
} from "./youtubeSnipet.js";

// 外部script読み込み待機
document.addEventListener("DOMContentLoaded", async (event) => {
  await init();
  bindFunctionToDOM();

  // 50件ずつの配列として配列をネストする
  function nestAry50(accum, current, index) {
    // console.log(`accum: ${accum}, index: ${index}, current:${current}`);
    if (index % 50 === 0) {
      // あまりが０の時は配列を作成する
      const newNest = [current];
      accum.push(newNest);
      return accum;
    }
    accum[accum.length - 1].push(current);
    return accum;
  }

  function bindFunctionToDOM() {
    const elemVideosListRecursively = document.querySelector(
      "[data-func='videoslistrecursively']"
    );
    const elemChannel = document.querySelector("[data-func='channel']");
    const elemPlaylistItemsRecursively = document.querySelector(
      "[data-func='playlistitemsrecursively']"
    );
    const elemTest = document.querySelector("[data-func='test");

    elemTest.addEventListener("click", async () => {
      const elemForm = document.querySelector("form");
      const text = elemForm.elements.channelid.value;
      if (!text) {
        alert("Please Input Channel ID");
        return;
      }
      // videolistのIDを取得
      let res = await execChannel(text);
      const playlistId =
        res.result.items[0].contentDetails.relatedPlaylists.uploads;
      console.log(`playlistId: ${playlistId}}`);

      res = await execPlaylistItemsRecursively(playlistId);
      const parsedVideoIds = res.reduce(nestAry50, []);

      const videoList = (await execVideosListRecursively(parsedVideoIds)).flat();
      console.log(videoList)

      videoList.map(item => createVideoList(item))
    });

    elemVideosListRecursively.addEventListener("click", async () => {
      console.log(await execVideosListRecursively());
    });

    elemChannel.addEventListener("click", async () => {
      const list = await execChannel();
      console.log(list);
    });

    elemPlaylistItemsRecursively.addEventListener("click", async () => {
      const list = await execPlaylistItemsRecursively(ROKOCHAN.playlistId);
      console.log(list);
      const parsed = list.reduce(nestAry50, []);
      console.log(`parsedVideoList: ${JSON.stringify(parsed)}`);
    });
  }
});

const createLiSpan = (tag, text, parent, liclass=null) => {
  const li = document.createElement("li");
  if(liclass) li.className = liclass;
  const span = document.createElement("span");
  li.textContent = tag;
  span.textContent = text;
  li.appendChild(span);
  parent.appendChild(li);
  return li;
};

const createA = (tag, text, parent, href, className=null) => {
  const a = document.createElement('a')
  if(className) a.className = className
  a.href = href
  a.target = '_blank';
  const span = document.createElement('span')
  a.textContent = tag;
  span.textContent = text;
  a.appendChild(span)
  parent.appendChild(a)
  return a
}

function createVideoList  (item) {
  const elemTarget = document.querySelector(".view-area");

  const videoLink = `https://www.youtube.com/watch?v=${item.id}`;

  const elemOuterList = createLiSpan("", "", elemTarget, 'list-outer');
  const elemFlexRight = createLiSpan("", "", elemOuterList);
  const elemFlexLeft = createA("", "", elemOuterList, videoLink);

  const elemMain = createLiSpan("", "", elemFlexRight)
  const elemMisc = createLiSpan(":", "", elemFlexRight, "video-misc")

  createA(" ", item.snippet.title, elemMain, videoLink, "video-title");
  createLiSpan("公開日: ", item.snippet.publishedAt, elemMain);
  createLiSpan("再生時間: ", item.contentDetails.duration, elemMain);
  createLiSpan("視聴回数: ", item.statistics.viewCount, elemMisc);
  createLiSpan("👍: ", item.statistics.likeCount, elemMisc);
  createLiSpan("💬: ", item.statistics.commentCount, elemMisc);

  const li = document.createElement('li')
  const img = document.createElement('img')
  img.src = item.snippet.thumbnails.high.url
  li.appendChild(img)
  elemFlexLeft.appendChild(li)
}
