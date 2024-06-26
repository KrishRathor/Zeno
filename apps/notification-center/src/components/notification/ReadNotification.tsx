import React from "react";
import { INotificationMessage } from "./types";

export const ReadNotification: React.FC<INotificationMessage> = ({message}) => {
  return (
    <div className="flex border-dotted bg-[#262626] w-[21vw] mx-auto mt-3 h-[10vh] rounded-lg " >
      <div className="flex justify-between" >
        <div className=" mt-2 w-[17vw] " >
          <p className="ml-4" >{message}</p>
          <p className="text-[#8A8A8A] ml-4 text-sm " > 10 min ago </p>
        </div>
      </div>
    </div>
  )
}

