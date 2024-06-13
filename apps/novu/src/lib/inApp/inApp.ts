import { io, Socket } from "socket.io-client";
import HttpStatusCode from "../../types/enums";
import { IInAppTrigger, IInAppTriggerResponse } from "../../types/inApp.types";
import { INodeConstructor } from "../../types/node.type";
import { prisma } from "../db";
import { EVENTS } from "../ws/socket.types";

export class InApp {
  private appId: string;
  private socket: Socket;

  constructor(props: INodeConstructor) {
    this.appId = props.appId;
    this.socket = io('http://localhost:8000');
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


  async trigger (props: IInAppTrigger): Promise<IInAppTriggerResponse> {
    
    const isValid = await this.validateAppId();
    if (!isValid) {
      return {
        code: HttpStatusCode.UNAUTHORIZED,
        message: 'UNAUTHORIZED',
        response: null
      }
    }
  
    try {
        
      const { subscriberId } = props;

      const getDeveloper = await prisma.developer.findFirst({
        where: {
          appId: this.appId
        }
      })

      const getSubscriber = await prisma.subscriber.findFirst({
        where: {
          subscriberId,
          developerId: getDeveloper?.id
        }
      })

      if (!getSubscriber) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "subscriber not found",
          response: null
        }
      }

      console.log('inside inapp');

      // here we got the subscriber now we need to send him some notification
      // currently we are not gettnig notification from developer so let's send 
      // some dummy notification, hi there
      // for this we need socket id of subscriber
      this.socket.emit(EVENTS.ON_TRIGGER_INAPP, {
        subscriberId: getSubscriber.subscriberId,
        appID: this.appId
      })

      return {
        code: HttpStatusCode.OK,
        message: 'send notification',
        response: null
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        response: null
      }
    } finally {
      await prisma.$disconnect();
    }
  
  }

}
