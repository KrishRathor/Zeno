import { NotificationComponent } from "@/components/notification/NotificationComponent";
import { useSocket } from "@/context/socket";

export default function Home() {

  const { notifications } = useSocket();
  console.log(notifications); 

  return (
   <div>
      <NotificationComponent />
    </div>
 );
}


