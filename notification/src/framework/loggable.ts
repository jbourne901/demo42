export default class Loggable {
    protected static getClassName() {
        return "Loggable";
    }

    protected static getMyself(funcname: string) {
        return this.getClassName() + "." + funcname;
    }
}
