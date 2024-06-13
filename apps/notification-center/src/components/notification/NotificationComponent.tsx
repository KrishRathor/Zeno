import React from "react";
import { NotificationTop } from "./NotificationTop";
import { UnReadNotification } from "./UnReadNotification";
import { ReadNotification } from "./ReadNotification";

export const NotificationComponent: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A] overflow-y-auto rounded-md w-[24vw] m-4 p-2 h-[50vh] " >
      <NotificationTop />
      <hr className="mt-2 h-[1px] bg-[#4D4D4D] " />
      <UnReadNotification />
      <UnReadNotification />
      <ReadNotification />
      <ReadNotification />
    </div>

  )
}
