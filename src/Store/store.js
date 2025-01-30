import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import storage from "redux-persist/lib/storage"
import persistReducer from "redux-persist/es/persistReducer"
import persistStore from "redux-persist/es/persistStore"

const persistConfig = { 
    key: 'currentUserData',
    storage
}

const persistedReducer = persistReducer(persistConfig, userReducer)
export const store = configureStore({
    reducer: {
        userData: persistedReducer,
    }
})

export const persistor = persistStore(store);