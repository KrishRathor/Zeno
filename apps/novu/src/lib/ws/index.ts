import http from "http";
import { SocketService } from "./socket";

async function init() {
  const httpServer = http.createServer();
  const socketService = new SocketService();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Http Server started at ${PORT}`);
  })

  socketService.initListeners();

}

init()
