/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/

const loader = function () {
  const elemBlocker = document.querySelector(".blocker") as HTMLElement;

  const isCustomEvent = (event: Event): event is CustomEvent => {
    return "detail" in event;
  };

  const listner: EventListener = (event: Event) => {
    if (!isCustomEvent(event)) return;

    if (event.detail) {
      elemBlocker.dataset.busy = "true";
    } else {
      elemBlocker.dataset.busy = "false";
    }
  };
  document.addEventListener("busy", listner);
};

export { loader };
