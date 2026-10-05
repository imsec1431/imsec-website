import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Cartslice"; // ✅ Ensure correct path
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ Uses localStorage for persistence
import { combineReducers } from "redux";
import authReducer from "./authSlice"; // ✅ Ensure correct path

// ✅ Combine all reducers
const rootReducer = combineReducers({
  cart: cartReducer, // ✅ Ensure this matches `useSelector(state => state.cart)`
});

// ✅ Configure persistence
const persistConfig = {
  key: "root",
  storage, // ✅ Saves state in localStorage
};

// ✅ Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  auth: authReducer, // ✅ Add auth reducer
});

// ✅ Create a persistor for the store
export const persistor = persistStore(store);
export default store;
