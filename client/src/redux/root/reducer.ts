import { combineReducers } from "redux";
import languageReducer from "../language/reducer";

const reducer = combineReducers({language: languageReducer});

export default reducer;