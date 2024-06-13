import React, { useEffect, useState } from "react";
import { NotificationTop } from "./NotificationTop";
import { UnReadNotification } from "./UnReadNotification";
import { ReadNotification } from "./ReadNotification";
import { INotificationComponentProps } from "./types";

export const NotificationComponent: React.FC<INotificationComponentProps> = (props) => {

  const { notifications } = props;

  return (
    <div className="bg-[#1A1A1A] overflow-y-auto rounded-md w-[24vw] m-4 p-2 h-[50vh] " >
      <NotificationTop />
      <hr className="mt-2 h-[1px] bg-[#4D4D4D] " />
      
      {
        notifications.map(notification => {
          if (!notification.read) {
            return <UnReadNotification message={notification.message} />;
          } else {
            return <ReadNotification message={notification.message} />;
          }
        })
      }

   </div>

  )
}
