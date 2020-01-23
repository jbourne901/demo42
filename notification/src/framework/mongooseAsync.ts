import * as Bluebird from "bluebird";
import mongoose from "mongoose";
import { ConnectionOptions } from "mongoose";
import BowLog from "./bow-log";
import Loggable from "./loggable";

export interface IDocumentAsync extends mongoose.Document {
    saveAsync(options?: mongoose.SaveOptions | undefined): Promise<this>;
}

export interface IModelAsync<T extends IDocumentAsync> extends mongoose.Model<T, {}> {
     findByIdAsync(id: any): Promise<T>;
     findOneAsync(conditions: any): Promise<T>;
     createAsync(docs: T[]): Promise<T>;
     findByIdAndUpdateAsync(id: any, update: any): Promise<T>;
     findByIdAndDeleteAsync(id: any): Promise<T>;
     findAsync(conditions?: any): Promise<T[]>;
}

export class MongooseAsync extends Loggable {
    public static getClassName() {
        return "mongooseAsync";
    }

    constructor() {
        super();
        Bluebird.Promise.promisifyAll(mongoose);
    }

    public createSchema<T extends IDocumentAsync>(fields: any): mongoose.Schema<T> {
        return new mongoose.Schema<T>(fields);
    }

    public createModel<T extends IDocumentAsync>(name: string, schema: mongoose.Schema<T>): IModelAsync<T> {
        return mongoose.model<T>(name, schema) as IModelAsync<T>;
    }

    public connect(url: string, options: ConnectionOptions) {
        const myself = MongooseAsync.getMyself("connect");
        BowLog.log1(myself, "");
        return mongoose.connect(url, options);
    }

}

const mongooseAsync = new MongooseAsync();
export default mongooseAsync;
