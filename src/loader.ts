/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/

import { busyStatus } from "./type";

const a = new CustomEvent("click");

class LoaderEvent extends CustomEvent<busyStatus> {
  constructor(type: string, eventInitDict?: CustomEventInit<busyStatus>) {
    super(type, eventInitDict);
  }
}

const loaderInit = function () {
  const elemBlocker = document.querySelector(".blocker") as HTMLElement;

  const listner: EventListener = (event: LoaderEvent) => {
    if (event.detail.isUiLock) {
      elemBlocker.dataset.isshow = "true";
    } else {
      elemBlocker.dataset.isshow = "false";
    }
  };
  document.addEventListener("busy", listner);
};

export { loaderInit, LoaderEvent };
