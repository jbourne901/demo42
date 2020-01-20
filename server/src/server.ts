import express, { NextFunction, Request, Response } from "express";
import createError from "create-error";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import mongooseAsync from "./framework/mongooseAsync";
import Loggable from "./framework/loggable";
import BowLog from "./framework/bow-log";
import UserRouter from "./routes/user";
import AuthRouter from "./routes/auth";

class App extends Loggable {

  public static start() {

    const myself = this.getMyself("start");

    dotenv.config( { debug: true } );
    let PORT: number = 0;
    if (process.env.BIND_PORT) {
        PORT = Number.parseInt(process.env.BIND_PORT || "", 10);
    }
    const HOST = process.env.BIND_HOST || "";
    const DB_URL = process.env.DB_URL || "";

    BowLog.log1(myself, "port=" + PORT + " host=" + HOST + " db_url=" + DB_URL);

    mongooseAsync.connect(DB_URL, {useNewUrlParser: true , useUnifiedTopology: true});

    const app: express.Application = express();
    app.set("port", PORT);

    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api/user", UserRouter.getRouter());
    app.use("/api/auth", AuthRouter.getRouter());

    const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
                            BowLog.log1(myself, "notFoundHandler");
                            next(createError());
    };

    app.use( notFoundHandler );

    const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
      BowLog.log1(myself, "Error 404 " + req.url);
      console.dir(req.body);
      const status: number = err.status || 500;
      return res.status(status).end();
    };

    app.use(errorHandler);
    app.listen(PORT, HOST, () => {
       console.log("listening");
    });
  }

  protected static getClassName() {
    return "App";
  }
}

App.start();
