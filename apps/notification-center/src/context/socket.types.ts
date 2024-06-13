export interface SocketProviderProps {
  children?: React.ReactNode;
}

export interface ISocketContext {
  notifications: string[]
}

export enum EVENTS {
  ON_TRIGGER_INAPP = 'ON_TRIGGER_INAPP',
  SEND_NOTIFICATION_INAPP = 'SEND_NOTIFICATION_INAPP'
}

export interface IIncomingNotificationProps {
  notification: string
}
