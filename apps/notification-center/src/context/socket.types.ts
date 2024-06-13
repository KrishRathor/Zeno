export interface SocketProviderProps {
  children?: React.ReactNode;
}

export interface ISocketContext {
  notifications: ISingleNotificationProps[]
}

export enum EVENTS {
  ON_TRIGGER_INAPP = 'ON_TRIGGER_INAPP',
  SEND_NOTIFICATION_INAPP = 'SEND_NOTIFICATION_INAPP'
}

export interface ISingleNotificationProps {
  message: string,
  read: boolean
}

export interface IIncomingNotificationProps {
  notification: ISingleNotificationProps
}
