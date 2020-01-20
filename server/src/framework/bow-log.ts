export default class BowLog {

    public static log(myself: string, message: string) {
      console.log(myself + ": " + message);
    }

    public static log1(myself: string, message: string) {
      this.log(myself + "1", message);
    }

    public static error(myself: string, error: string) {
     this.log(myself, "Errrror " + error);
    }

    public static log2(myself: string, message: string) {
      this.log(myself + "2", message);
    }

    public static log3(myself: string, message: string) {
     this.log(myself + "3", message);
    }

    public static log4(myself: string, message: string) {
      this.log(myself + "4", message);
    }

    public static log5(myself: string, message: string) {
      this.log(myself + "5", message);
    }

    public static log6(myself: string, message: string) {
      this.log(myself + "6", message);
    }

    public static debug(myself: string, message: string) {
       if (this.DEBUG_LEVEL > 0) {
         this.log(myself, message);
       }
    }

    public static dir(myself: string, obj: any) {
      this.log(myself, "");
      console.dir(obj);
    }

    public static logobj(myself: string, message: string, obj: any) {
        let tmp = "";
        if (obj != null) {
           const arr = Object.keys(obj);
           for ( const f of arr ) {
              if (f != null ) {
                 tmp = tmp + " " + f + "=" + obj[f] + "\n";
              }
           }
        }
        this.log(myself, message + tmp);
      }
      private static DEBUG_LEVEL = 0;
}
