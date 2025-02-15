/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/

import { BusyStatus } from "./type";
import { addCustomEvent } from "./utilFunctions";

class LoaderEvent extends CustomEvent<BusyStatus> {
  constructor(type: string, eventInitDict?: CustomEventInit<BusyStatus>) {
    super(type, eventInitDict);
  }
}

const loaderInit = function () {
  const elemBlocker = document.querySelector(".blocker") as HTMLElement;

  const listner = (event: Event) => {
    if(!isLoaderEvent(event)) return;

    if (event.detail.isUiLock) {
      elemBlocker.dataset.isshow = "true";
    } else {
      elemBlocker.dataset.isshow = "false";
    }
  };

  addCustomEvent("busy", listner)
};

function isLoaderEvent(event: Event): event is LoaderEvent {
  return event instanceof LoaderEvent 
}

export { loaderInit, LoaderEvent };
