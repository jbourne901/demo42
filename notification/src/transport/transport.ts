import Loggable from "../framework/loggable";
import http from "http";
import socketio, {Socket} from "socket.io";
import BowLog from "../framework/bow-log";

class Transport extends Loggable {
    private io: socketio.Server;

    constructor(app: http.Server) {
        super();
        this.io = socketio.listen(app);
        this.io.sockets.on("connection", (socket: Socket) => this.onConnection(socket) );
    }

    public send(message: string) {
        const myself = Transport.getMyself("send");
        BowLog.log(myself, message);
        this.io.emit("datachange", message);
    }

    protected onConnection(socket: Socket) {
        const myself = Transport.getMyself("onConnection");
        BowLog.log(myself, "new client connected");
        socket.on("disconnect", ()  => {
            BowLog.log(myself, "client disconnected");
        });
    }
}

export default Transport;
