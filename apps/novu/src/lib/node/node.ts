import { INodeConstructor } from "../../types/node.type";
import { prisma } from "../db";
import { InApp } from "../inApp/inApp";
import { Subscriber } from "../subscribers/subscriber";
import { Topic } from "../topics/topic";

export class NodeNotification {

  private appId: string;
  Subscriber: Subscriber;
  Topic: Topic;
  InApp: InApp;

  constructor(props: INodeConstructor) {
    const { appId } = props;
    this.appId = appId;
    this.Subscriber = new Subscriber({
      appId
    });
    this.Topic = new Topic(appId);
    this.InApp = new InApp({
      appId
    })
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
}

