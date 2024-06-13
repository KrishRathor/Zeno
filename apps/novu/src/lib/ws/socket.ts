import { Server } from "socket.io";
import { EVENTS, IOnTriggerInAppProps, } from "./socket.types";

const subscribersToSocketId: any = {};
const subscribersToSocket: any = {};

export class SocketService {

  private _io: Server;

  constructor() {
    console.log(`Init socket service...`);
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    })
  }

  public initListeners() {
    console.log(`Initialized listeners...`);

    const io = this.io;

    io.on('connect', (socket) => {
      console.log(`New Socket connected with socket id : ${socket.id}`);

      const { subscriberId, appID } = socket.handshake.query;
      console.log(`yo ${subscriberId} ${appID}`);
      if (typeof subscriberId === "string" && typeof appID === "string") {
        subscribersToSocketId[`${subscriberId}-${appID}`] = socket.id;
        subscribersToSocket[`${subscriberId}-${appID}`] = socket;
      }

      socket.on(EVENTS.ON_TRIGGER_INAPP, (props: IOnTriggerInAppProps) => {
        const { appID, subscriberId } = props;
        const socketId = subscribersToSocketId[`${subscriberId}-${appID}`];        
        console.log(socketId);

        if (!socketId) {
          return;
        }

        io.to(socketId).emit(EVENTS.SEND_NOTIFICATION_INAPP, {
          notification: 'Krish has uploaded a new post'
        })

      })

    })

  }

  get io() {
    return this._io;
  }

}
