interface IMemoizeFunc<T> {
   (...args: any[]): T;
}

interface IMemoizeFuncCreator<T> {
    (): IMemoizeFunc<T>;
}

export class Memoize<T> {

    private lastArgs: any[] = [];
    private result?: T;
    private creator: IMemoizeFuncCreator<T>;

    constructor( f: IMemoizeFuncCreator<T>) {
        this.creator = f;        
    }

    public find() {
        return (...args: any[]) => {
            if(this.areSameArgs(args)) {
                console.log("Memoize - found result for the same args");
                console.dir(this.lastArgs);
                console.log("=")
                console.dir(this.result);
                return this.result;
            }
            this.lastArgs = args;
            this.result = this.creator()(args);
            console.log("Memoize - new args - memorizing args=");
            console.dir(args);
            console.log(" result = ");
            console.dir(this.result);
            return this.result;
        };
    }

    protected areSameArgs(args: any[]) {
        if(args.length !== this.lastArgs.length) {
            return false;
        }
        for (let i = 0; i < args.length; i++) {
            if (this.lastArgs[i] !== args[i]) {
                 return false
            }
        }
        return true;
    }
}