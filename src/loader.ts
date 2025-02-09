/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/
const loader = function () {
  const elemBlocker = document.querySelector(".blocker") as HTMLElement;
  document.addEventListener("busy", (event: CustomEvent) => {
    if (event.detail) {
      elemBlocker.dataset.busy = "true";
    } else {
      elemBlocker.dataset.busy = "false";
    }
  });
};

export { loader };
