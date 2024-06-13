import React, { useCallback, useContext, useEffect, useState } from "react";
import { EVENTS, IIncomingNotificationProps, ISocketContext, SocketProviderProps } from "./socket.types";
import { Socket, io } from "socket.io-client";

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleIncomingNotifications = useCallback((data: IIncomingNotificationProps) => {
    console.log(data);
    setNotifications(prev => [...prev, data.notification]);
  }, []);

  useEffect(() => {

    const _socket = io('http://localhost:8000', {
      query: {
        subscriberId: 'user1',
        appID: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktyaXNoIiwiZW1haWwiOiJrcmlzaHJhdGhvcjE4QGdtYWlsLmNvbSIsImlhdCI6MTcxNzg2NjM1N30.WbuV90gvLBa1FWrs0LmCjtYilQTmgVQ17qOHCjr2lW8`
      }
    });

    _socket.on(EVENTS.SEND_NOTIFICATION_INAPP, handleIncomingNotifications);

    setSocket((_prev) => _socket);

    return () => {
      setSocket(undefined);
    }

  }, []);

  return (
    <SocketContext.Provider value={{
      notifications
    }}>
      {children}
    </SocketContext.Provider>
  );

}
