"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Loggable {
    static getClassName() {
        return "Loggable";
    }
    static getMyself(funcname) {
        return this.getClassName() + "." + funcname;
    }
}
exports.default = Loggable;
//# sourceMappingURL=loggable.js.map