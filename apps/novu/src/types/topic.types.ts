export interface ICreateTopic {
  title: string
}

export interface ICreateTopicResponse {
  code: number,
  message: string,
  topic: any
}

export interface IAddSubscriberToTopic {
  title: string,
  subscriberId: string
}

export interface IAddSubscriberToTopicResponse {
  code: number,
  message: string,
  topic: any
}
