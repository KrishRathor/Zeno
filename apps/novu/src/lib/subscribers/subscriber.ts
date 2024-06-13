import jwt from "jsonwebtoken";
import HttpStatusCode from "../../types/enums";
import { IDecodedToken, INodeConstructor } from "../../types/node.type";
import { IAddSubscirber, IAddSubscirberResponse } from "../../types/subscriber.types";
import { prisma } from "../db";

export class Subscriber {

  private appId: string;

  constructor(props: INodeConstructor) {
    this.appId = props.appId;
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

  async addSubscriber(props: IAddSubscirber): Promise<IAddSubscirberResponse> {
    const isValid = await this.validateAppId();
    if (!isValid) {
      return {
        code: HttpStatusCode.UNAUTHORIZED,
        message: 'Invalid api key',
        subscriber: null
      };
    }

    try {
      
      const { subscriberId } = props;

      const checkSubscriber = await prisma.subscriber.findFirst({
        where: {
          subscriberId
        }
      })

      if (checkSubscriber) {
        return {
          code: HttpStatusCode.BAD_REQUEST,
          message: "Subscriber already exist",
          subscriber: null
        }
      }

      const payload = jwt.decode(this.appId);

      if (typeof payload === "string" || !payload) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          subscriber: null
        }
      } 

      console.log('payload', payload);
      const { username } = payload;

      if (!username) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message: "inavlid api key",
          subscriber: null
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
          subscriber: null
        } 
      }

      const createSubscriber = await prisma.subscriber.create({
        data: {
          subscriberId,
          developerId: developer.id 
        }
      })

      return {
        code: HttpStatusCode.OK,
        message: "created new subscriber",
        subscriber: createSubscriber
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        subscriber: null
      }
    } finally {
      await prisma.$disconnect();
    }
  }

}
