import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import userReducer from "./features/login/loginSlice";
import editorReducer from "./features/editor/editorSlice";
const rootReducer = combineReducers({
  user: userReducer,
  editor: editorReducer,
  // Add other reducers here
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the user reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
