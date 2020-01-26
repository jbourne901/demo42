export interface ISession {
    sessionkey: string;
}
export const NoSession: ISession = {
    sessionkey: ""
};