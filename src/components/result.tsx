import * as React from "react";
import List from "./list"
import Summary from "./summary"
import Channel from "./channle"
import { Store } from "../store";

export default function Result({ store }: { store: Store }) {
  return (
    <div className="">
      <Channel channelResources={store.fetchedData.channelResources} />

      {store.fetchedData.videoResources.map((resources) => (
        <List item={resources} key={resources.id} />
      ))}

      <Summary store={store} />

      <div className="blocker" data-isshow="false">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  );
};

