const API_KEY = import.meta.env.VITE_API_KEY;

/*########################################*
 ** クライアントライブラリを読み込む
 * @returns void
 *
 * https://github.com/google/google-api-javascript-client/blob/master/docs/start.md
 ########################################*/
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function() {
        console.log("GAPI client loaded for API");
      },
      function(err) {
        console.error("Error loading GAPI client for API", err);
      },
    );
}

/******************************************
 * gapi初期化処理が終わるまで待機する
 *****************************************/
export default async function gapiInit() {
  return new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      await loadClient();
      resolve(() => { });
    });
  });
}


