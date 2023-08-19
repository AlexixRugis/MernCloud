import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import fileReducer from "./fileReducer";
import userReducer from "./userReducer";
import uploadReducer from "./uploadReducer";
import appReducer from "./appReducer";

const CLEAR = 'CLEAR';

const rootReducer = combineReducers({
    user: userReducer,
    file: fileReducer,
    upload: uploadReducer,
    app: appReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const clear = () => ({ type: CLEAR });