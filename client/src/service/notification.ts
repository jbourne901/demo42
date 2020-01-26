import socketio from "socket.io-client";

type INotificationHandlerFunc = () => void;

interface INotificationHandler {
  handlerid: string;
  func: INotificationHandlerFunc;
}

interface INotificationHandlers {
  [topic: string]: INotificationHandler[];
}

export interface INotificationService {
  register(topic: string, handlerid: string, handler: INotificationHandlerFunc): void;
  unregister(topic: string, handlerid: string): void;
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
           const topicHandlers = this.handlers[data] || [];
           topicHandlers.forEach( (h) => h.func() );
        });
    }

    public register(topic: string, handlerid: string, handlerFunc: INotificationHandlerFunc) {
      console.log("registering handler for topic " + topic +" handlerid = "+handlerid);
      const topicHandlers = this.handlers[topic] || [];
      const handler: INotificationHandler = {handlerid, func: handlerFunc};
      this.handlers[topic] = [...topicHandlers, handler]
    }

    public unregister(topic: string, handlerid: string) {
      console.log("unregistering topic=" + topic + " handlerid = "+handlerid);
      const topicHandlers = this.handlers[topic] || [];
      const newHandlers = topicHandlers.filter( (h) => h.handlerid!==handlerid );
      this.handlers[topic] = newHandlers;
    }
}
