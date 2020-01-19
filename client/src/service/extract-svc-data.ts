import {AxiosResponse} from "axios";

export default function extractSvcData<T>(res: AxiosResponse<T>) {
    return res.data;
};
