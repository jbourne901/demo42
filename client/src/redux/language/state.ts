import {IStateWithPayload, DefaultStateValue} from "../common/state";
import {DefaultLanguageInfoValue, ILanguageInfo, } from "../../model/language"

export type ILanguageState = IStateWithPayload<ILanguageInfo>;

export const DefaultLanguageStateValue: ILanguageState = {
    ...DefaultStateValue,
    payload: DefaultLanguageInfoValue
};

