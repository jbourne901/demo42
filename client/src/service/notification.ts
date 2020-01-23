import socketio from "socket.io-client";

type INotificationHandlerFunc = () => void;

interface INotificationHandler {
  topic: string;
  func: INotificationHandlerFunc;
}

interface INotificationHandlers {
  [handlerid: string]: INotificationHandler;
}

export interface INotificationService {
  register(topic: string, handlerid: string, handler: INotificationHandlerFunc): void;
  unregister(handlerid: string): void;
}

export class NotificationService implements INotificationService {
    private handlers: INotificationHandlers = {};
    private readonly BASE_URL: string;
    constructor() {
        this.BASE_URL=process.env.REACT_APP_NOTIFICATION_URL || "";
        const socket = socketio(this.BASE_URL);
        console.log("connecting to "+this.BASE_URL);
        socket.on("datachange", (data: string) => {
          console.log("+++++++++++++datachange");
          console.dir(data);
          for( const hid in this.handlers) {
            const h = this.handlers[hid];
            if(h.topic === data && h.func) {
              console.log("calling handler "+hid+" for topic "+data)
                h.func();
            }
          }
        });    
    }

    public register(topic: string, handlerid: string, handlerFunc: INotificationHandlerFunc) {
      console.log("registering handler for "+topic+" handlerid = "+handlerid);
      this.handlers[handlerid] = {topic, func: handlerFunc};
    }

    public unregister(handlerid: string) {
      console.log("unregistering handlerid = "+handlerid);
      delete this.handlers[handlerid];
    }
}
