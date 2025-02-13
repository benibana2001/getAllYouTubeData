type busyType = "LoadingChannel" | "LoadingVideoList";

type busyStatus = {
  type: busyType;
  isUiLock: boolean;
};

export { busyStatus, busyType };
