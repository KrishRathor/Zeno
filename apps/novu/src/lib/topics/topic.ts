import HttpStatusCode from "../../types/enums";
import { IAddSubscirberResponse } from "../../types/subscriber.types";
import { IAddSubscriberToTopic, IAddSubscriberToTopicResponse, ICreateTopic, ICreateTopicResponse } from "../../types/topic.types";
import { prisma } from "../db";
import jwt from "jsonwebtoken";

export class Topic {
  private appId: string;

  constructor(appId: string) {
    this.appId = appId
  }

  private async validateAppId(): Promise<boolean | void> {
    try {
      const isUserValidated = await prisma.developer.findFirst({
        where: {
          appId: this.appId
        }
      });

      if (!isUserValidated) {
        throw new Error("Invalid Appid");
      }

      return true;

    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error");
    } finally {
      await prisma.$disconnect();
    }
  }

  async createTopic(props: ICreateTopic): Promise<ICreateTopicResponse> {

    const isValid = await this.validateAppId();
    if (!isValid) {
      return {
        code: HttpStatusCode.UNAUTHORIZED,
        message: "invlaid api key",
        topic: null
      }
    }

    try {
      const { title } = props;

      const checkTopic = await prisma.topic.findFirst({
        where: {
          title
        }
      })

      if (checkTopic) {
        return {
          code: HttpStatusCode.BAD_REQUEST,
          message: "topic title already exists",
          topic: null
        }
      }

      const payload = jwt.decode(this.appId);

      if (typeof payload === "string" || !payload) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      const { username } = payload;

      if (!username) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      const developer = await prisma.developer.findFirst({
        where: {
          username
        }
      })

      if (!developer) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      const topic = await prisma.topic.create({
        data: {
          title,
          developerId: developer.id
        }
      })

      return {
        code: HttpStatusCode.OK,
        message: "created new topic",
        topic
      }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        topic: null
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async addSubscriber(props: IAddSubscriberToTopic): Promise<IAddSubscriberToTopicResponse> {

    const isValid = await this.validateAppId();
    if (!isValid) {
      return {
        code: HttpStatusCode.UNAUTHORIZED,
        message: "invlaid api key",
        topic: null
      }
    }

    try {

      const { title, subscriberId } = props;

      const isTopic = await prisma.topic.findFirst({
        where: {
          title
        }
      });

      if (!isTopic) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "Not found topic",
          topic: null
        }
      }

      let isSubscriber = await prisma.subscriber.findFirst({
        where: {
          subscriberId
        }
      });

      const payload = jwt.decode(this.appId);

      if (typeof payload === "string" || !payload) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      console.log('payload', payload);
      const { username } = payload;

      if (!username) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      const developer = await prisma.developer.findFirst({
        where: {
          username
        }
      })

      if (!developer) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          topic: null
        }
      }

      if (!isSubscriber) {
        isSubscriber = await prisma.subscriber.create({
          data: {
            subscriberId,
            developerId: developer.id
          }
        })
      }

      const addSubscriberToTopic = await prisma.topicSubscriber.create({
        data: {
          topicId: isTopic.id,
          subscriberId: isSubscriber.id
        }
      })

      return {
        code: HttpStatusCode.OK,
        message: 'added subscriber',
        topic: addSubscriberToTopic
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        topic: null
      }
    } finally {
      await prisma.$disconnect();
    }

  }

  async removeSubscriber(props: IAddSubscriberToTopic): Promise<IAddSubscriberToTopicResponse> {

    try {

      const { title, subscriberId } = props;

      const isTopic = await prisma.topic.findFirst({
        where: {
          title
        }
      });

      if (!isTopic) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "Not found topic",
          topic: null
        }
      }

      const isSubscriber = await prisma.subscriber.findFirst({
        where: {
          subscriberId
        }
      });

      if (!isSubscriber) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "not found subscriber",
          topic: null
        }
      } 

      const isTopicSubscriber = await prisma.topicSubscriber.findFirst({
        where: {
          topicId: isTopic.id,
          subscriberId: isSubscriber.id
        }
      })

      if (!isTopicSubscriber) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "not found subscriber",
          topic: null
        }
      }

      const removeSubscriberFromTopic = await prisma.topicSubscriber.delete({
        where: {
          id: isTopicSubscriber.id
        }
      })

      return {
        code: HttpStatusCode.OK,
        message: "removed subscriber from topic",
        topic: removeSubscriberFromTopic
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        topic: null
      }
    } finally {
      await prisma.$disconnect();
    }

  }

}
