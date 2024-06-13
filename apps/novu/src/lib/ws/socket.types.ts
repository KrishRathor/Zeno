export enum EVENTS {
  ON_TRIGGER_INAPP = 'ON_TRIGGER_INAPP',
  SEND_NOTIFICATION_INAPP = 'SEND_NOTIFICATION_INAPP'
}

export interface IOnTriggerInAppProps {
  appID: string,
  subscriberId: string,
  message: string,
  read: boolean
}
