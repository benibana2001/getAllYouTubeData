/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/

import { busyStatus } from "./type";

class LoaderEvent extends CustomEvent<busyStatus> {
  constructor(type: string, eventInitDict?: CustomEventInit<busyStatus>) {
    super(type, eventInitDict);
  }
}


const loaderInit = function () {
  const elemBlocker = document.querySelector(".blocker") as HTMLElement;

  const listner: EventListener = (event: Event) => {
    if(!isLoaderEvent(event)) return;

    if (event.detail.isUiLock) {
      elemBlocker.dataset.isshow = "true";
    } else {
      elemBlocker.dataset.isshow = "false";
    }
  };
  document.addEventListener("busy", listner);
};

function isLoaderEvent(event: Event): event is LoaderEvent {
  return event instanceof LoaderEvent 
}

export { loaderInit, LoaderEvent };
