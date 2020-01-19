"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    static getClassName() {
        return "Controller";
    }
    static sendSuccess(req, res, next) {
        res.json({ result: "OK" });
    }
    static sendSuccessWithPayload(payload, req, res, next) {
        res.json({ payload, result: "OK" });
    }
    static sendError(error, req, res, next) {
        res.status(500).json({ result: "Error", errors: { error } });
    }
    static sendErrors(errors, req, res, next) {
        res.status(500).json({ result: "Error", errors });
    }
}
exports.default = Controller;
//# sourceMappingURL=controller.js.map