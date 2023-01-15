import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import authReducer from "./modules/auth";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "mechanicapp",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
