"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BowLog {
    static log(myself, message) {
        console.log(myself + ": " + message);
    }
    static log1(myself, message) {
        this.log(myself + "1", message);
    }
    static error(myself, error) {
        this.log(myself, "Errrror " + error);
    }
    static log2(myself, message) {
        this.log(myself + "2", message);
    }
    static log3(myself, message) {
        this.log(myself + "3", message);
    }
    static log4(myself, message) {
        this.log(myself + "4", message);
    }
    static log5(myself, message) {
        this.log(myself + "5", message);
    }
    static debug(myself, message) {
        if (this.DEBUG_LEVEL > 0) {
            this.log(myself, message);
        }
    }
    static logobj(myself, message, obj) {
        let tmp = "";
        if (obj != null) {
            const arr = Object.keys(obj);
            for (const f of arr) {
                if (f != null) {
                    tmp = tmp + " " + f + "=" + obj[f] + "\n";
                }
            }
        }
        this.log(myself, message + tmp);
    }
}
exports.default = BowLog;
BowLog.DEBUG_LEVEL = 0;
//# sourceMappingURL=bow-log.js.map