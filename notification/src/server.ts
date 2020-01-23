import http from "http";

import Loggable from "./framework/loggable";
import BowLog from "./framework/bow-log";
import dotenv from "dotenv";
import DB from "./db";
import Transport from "./transport";

class App extends Loggable {

  public static start() {

    const myself = this.getMyself("start");

    dotenv.config( { debug: true } );
    let PORT: number = 0;
    if (process.env.BIND_PORT) {
        PORT = Number.parseInt(process.env.BIND_PORT || "", 10);
    }
    const HOST = process.env.BIND_HOST || "";

    BowLog.log1(myself, "port=" + PORT + " host=" + HOST);

    const app = http.createServer( () => App.httpHandler() );
    const transport = new Transport(app);
    const db = new DB((args: any) => transport.send(args));
    db.start();

    app.listen(PORT, HOST, () => {
      BowLog.log(myself, "listening");
    });

  }

  protected static getClassName() {
    return "App";
  }

  protected static httpHandler() {
    const myself = App.getMyself("httpHandler");
    BowLog.log(myself, "handler");
  }
}

App.start();
