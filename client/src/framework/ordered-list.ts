import {ensure} from "./ensure";
import {IHandle} from "../model/handle";

export default class OrderedList<T> {
    private maxHandles: number;
        
    private allHandles: (T|undefined)[];
    private orderedHandles: IHandle[];
    private availableHandles: IHandle[];
    private maxAllocatedHandle: IHandle = -1;
    private listName: string;


    constructor(listName: string, maxHandles: number) {
        this.listName=listName;
        this.maxHandles = maxHandles;
        this.allHandles = Array<(T|undefined)>(maxHandles);
        this.orderedHandles=[];
        this.availableHandles=[...Array(maxHandles)].map((_, i) => i);
    }

    
    public add(t: T) {
        ensure( (this.availableHandles.length>0), this.listName+" Unable to allocate handle");
        if(this.availableHandles.length<=0) {
            return undefined;
        }            
        const h = this.availableHandles[0];
        ensure( (h !== undefined), this.listName+" Unable to allocate handle");
        const tt = this.allHandles[h];
        ensure ( (tt === undefined), this.listName+" Already allocated" );
        if(this.maxAllocatedHandle < h) {
            this.maxAllocatedHandle = h;
        }
        this.availableHandles = this.availableHandles.splice(1);
        this.orderedHandles.push(h);
        this.allHandles[h]=t;
        console.log(this.listName+" add - successful h = "+h);
        return h;
    }

    protected checkHandleValid(h: IHandle) {
        ensure( (h<this.maxHandles), this.listName+" Invalid handle" );
    }


    public get(h: IHandle) {        
        this.checkHandleValid(h);
        const t: T|undefined = this.allHandles[h];
        ensure( (t !== undefined), this.listName+" No object at handle");
        return t;
    }

    
    public safeGet(h?: IHandle) {        
        if(h!==undefined) {
            this.checkHandleValid(h);
            const t: T|undefined = this.allHandles[h];
            ensure( (t !== undefined), this.listName+" no object at handle");
            return t;    
        }
        return undefined;
    }

    public update(h: IHandle, t: T) {
        this.checkHandleValid(h);
        this.allHandles[h] = t;        
    }

    public delete(h: IHandle) {
        this.checkHandleValid(h);
        const hh = this.availableHandles.findIndex( (n) => n===h);
        ensure( (hh<0), this.listName+" handle is already available" );
        this.allHandles[h] = undefined;
        this.availableHandles.push(h);
        const ndx = this.orderedHandles.findIndex( (n) => n===h);
        this.orderedHandles = [ ...(this.orderedHandles.slice(0, ndx)), ...(this.orderedHandles.slice(ndx+1)) ];
        if(h === this.maxAllocatedHandle) {
            this.maxAllocatedHandle = h-1;
        }
    }

    public list() {
        return this.orderedHandles;
    }

    public moveToEnd(h: IHandle) {
        this.checkHandleValid(h);
        const ndx = this.orderedHandles.findIndex( (n) => n===h);
        this.orderedHandles = [ ...(this.orderedHandles.slice(0, ndx)), ...(this.orderedHandles.slice(ndx+1)), h ];
    }

    public firstObject() {
        ensure( (this.orderedHandles.length>0), this.listName+" No allocated handles found");
        const h = this.orderedHandles[0];
        ensure( (h!==undefined),  this.listName+" No allocated handles found");
        return this.allHandles[h]
    }

    public getMaxAllocatedHandle() {
        return this.maxAllocatedHandle;
    }

    public findFirst( f: (t: T) => boolean ) : T|undefined {
        const ndx = this.orderedHandles.findIndex( (h) => {
                           const obj = this.safeGet(h);
                           return (obj!==undefined && f(obj) );
                        });
        if(ndx>=0) {
            return this.safeGet(this.orderedHandles[ndx]);
        }
        return undefined;
    }

}