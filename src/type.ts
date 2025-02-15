type busyType = "LoadingChannel" | "LoadingVideoList";

type Events = {
  busy: { type: busyType, isUiLock: boolean }
}

type BusyStatus = Events['busy']

export { BusyStatus , busyType, Events };
