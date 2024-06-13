import React from "react";

export const NotificationTop: React.FC = () => {

  return (
    <div className="flex justify-between" >
      <div className="flex ml-2" >
        <p className="text-xl" > Notifications </p>
        <div className="rounded-full bg-[#FFE14D] w-[24px] h-[24px] text-black p-1 flex items-center mt-[1px] ml-2 " > <p className="mx-auto" >2</p> </div>
      </div>
      <div className="text-[#4D4D4D] mr-2 mt-1" >
        Mark all as read
      </div>
    </div>


  )

}
