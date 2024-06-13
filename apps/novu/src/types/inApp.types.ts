export interface IInAppTrigger {
  subscriberId: string,
  read: boolean,
  message: string
}

export interface IInAppTriggerResponse {
  code: number,
  message: string,
  response: any
}
