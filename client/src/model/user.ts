export interface IUserInfo {
    id: string;
    name: string;
    username: string;
};

export interface IUser {
    id: string;
    name: string;
    username: string;
    password: string;
    password2: string;
};

export const UserDefault: IUser = {
    id: "",
    name: "",
    username: "",
    password: "",
    password2: ""
};
