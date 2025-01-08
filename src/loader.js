/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/
const loader = function () {
  const elemBlocker = document.querySelector(".blocker");
  document.addEventListener("busy", (event) => {
    if (event.detail) {
      elemBlocker.dataset.busy = "true";
    } else {
      elemBlocker.dataset.busy = "false";
    }
  });
};

export { loader };
