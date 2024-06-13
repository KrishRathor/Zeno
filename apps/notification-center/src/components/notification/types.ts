import { ISingleNotificationProps } from "@/context/socket.types";

export interface INotificationComponentProps {
  notifications: ISingleNotificationProps[]
}

export interface INotificationMessage {
  message: string
}
