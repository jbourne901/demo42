import {ILanguageState, DefaultLanguageStateValue} from "./state";
import {ILanguageAction} from "./action";

const languageReducer = (state: ILanguageState = DefaultLanguageStateValue, action: ILanguageAction) => {
    return state;
}

export default languageReducer;